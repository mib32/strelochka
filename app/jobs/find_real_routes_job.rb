# require 'iruby/rails'
# IRuby.load_rails

class FindRealRoutesJob < ApplicationJob
  def perform
    all_stations = eval(File.read(Rails.root.join('ALL_STATIONS')))
    # all_variations = all_stations.product(all_stations)
    i = 0
    all_variations = all_stations.map { |x| all_stations.map { |y| {
          fromCode:   x["c"],
          fromString: x["n"],
          toCode:     y["c"],
          toString:   y["n"]
        }
        i += 1
        puts 385847449 - i
      }
    }
    puts all_variations.count
  end

  def generate_matches_file
    cities = get_cities
    high_populated_cities = cities.select {|c| c["population"] > 200000}
    hp_city_matches = high_populated_cities.map.with_index {|c, i| {city: c, matches: all_stations.select {|s| c["name"].gsub('ё', 'е').upcase.in?(s["n"])}}}
    hp_city_matches.select {|c| c[:matches].none? }.count
    File.open('MATCHES.json', 'w') { |file| file.write(JSON.generate(hp_city_matches)) }
  end

  def get_cities
    f = File.read(Rails.root.join('russian-cities.json'))
    JSON.parse(f)
  end

  def get_matches
    JSON.parse(File.read(Rails.root.join('MATCHES.json')))
  end

  def write_down_permutations_results
    FetchTickets
    matches = get_matches
    permutations = matches.product(matches)
    permutations.reject! {|p| p[0]["city"]["name"] == p[1]["city"]["name"]}
    Parallel.each_with_index(permutations, in_threads: 4) do |p, i|
      retries = 0
      begin
        retries += 1
        Timeout::timeout(6) do
          date_range = Date.today..Date.today+7
          runs = date_range.map {|date| FetchTickets.new.fetch(date: date, from: p[0]["matches"][0]["c"], to: p[1]["matches"][0]["c"])}
          res = {i: i, from: p[0]["city"]["name"], to: p[1]["city"]["name"], runs: runs.map(){|r| r.any?}}
          File.open('INSPECTION', 'a') { |file| file.write("#{JSON.generate(res)}\n") }
        end
      rescue Timeout::Error, RestClient::Exception, RestClient::Exceptions::ReadTimeout, Errno::ECONNREFUSED, Errno::ECONNRESET, RestClient::GatewayTimeout, RestClient::Exceptions::OpenTimeout, RestClient::NotFound => e
        if retries > 6
          res = {i: i, from: p[0]["city"]["name"], to: p[1]["city"]["name"], errored: true}
          File.open('INSPECTION', 'a') { |file| file.write("#{JSON.generate(res)}\n") }
        else
          sleep(0.8)
          retry
        end
      end
    end
  end

  def inspection_to_real_routes
    inspection = File.readlines('INSPECTION').map {|l| JSON.parse(l)}
    inspection.sort_by! {|r| r["i"]}
    available_routes = inspection.filter {|r| r["runs"].any?}
    File.open(Rails.root.join('REAL_ROUTES'), 'w') {|f| available_routes.each{|r| f.write("#{r["from"]} => #{r["to"]}\n")}}
  end

  def generate_sitemap(for_yandex=false)
    routes = File.readlines('REAL_ROUTES').map {|l| l.split('=>').map(&:strip)}
    File.open(Rails.root.join('public', 'new_sitemap.xml'), 'w') do |file|
      file.write(%Q{<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">})
      routes.each do |r|

        from_string_human =  r[0]
        to_string_human   =  r[1]
        check_city_in_db = City.find_by!(name: from_string_human), City.find_by!(name: to_string_human)
        file.write(%Q{\n  <url>
    <loc>https://www.strelchka.ru/s/#{URI.encode(from_string_human)}/#{URI.encode(to_string_human)}#{for_yandex ? '#!' : ''}</loc>
    <lastmod>#{Date.today.strftime('%Y-%m-%d')}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>})
      end
      file.write("\n</urlset>")
    end
  end

  def populate_db
    matches = get_matches
    matches.each do |match|
      City.create name: match["city"]["name"], code: match["matches"][0]["c"], caps_name: match["matches"][0]["n"]
    end
  end

  def calculate_time_elapsed
    cities = get_cities
    cities.select {|c| c["population"] > 100000}.count ** 2 * 1.5 / 60.0 / 60.0
  end

  def add_more_real_routes_to_telegram
    FetchTickets
    cities = City.all
    permutations = cities.to_a.product(cities.to_a)
    inspection = File.readlines('INSPECTION').map {|l| JSON.parse(l)}
    # permutations.reject {|p| p[0].name == p[1].name || routes.include?("#{p[0].name} => #{p[1].name}\n")}.count

    new_permutations = permutations.reject.with_index do |p, i|
      index = inspection.find_index {|i| i["from"] == p[0].name && i["to"] == p[1].name}
      if index
        inspection.delete_at(index)
        next true
      else
        next false
      end
    end
    Parallel.each_with_index(new_permutations, in_threads: 4) do |p, i|
      retries = 0
      puts i
      begin
        retries += 1
        Timeout::timeout(6) do
          date_range = Date.today..Date.today+7
          runs = Parallel.map(date_range) {|date| FetchTickets.new.fetch(date: date, from: p[0].code, to: p[1].code).any?}
          puts runs.inspect
          if runs.any?
            if Rails.env.development?
              File.open(Rails.root.join('REAL_ROUTES'), 'a') {|f| f.write("#{p[0].name} => #{p[1].name}\n")}
            else
              message = "Route found: #{p[0].name} => #{p[1].name}"
              NotifyJob.perform_now(message, "TelegramBot")
            end
          end
        end
      rescue Timeout::Error, RestClient::Exception, RestClient::Exceptions::ReadTimeout, Errno::ECONNREFUSED, Errno::ECONNRESET, RestClient::GatewayTimeout, RestClient::Exceptions::OpenTimeout, RestClient::NotFound => e
        if retries > 6
          next
        else
          sleep(0.8)
          retry
        end
      end
    end
  end

end
