class AnalyzeTelegramData
  def print_telegram_routes_to_file
    file = File.read("/Users/antonmurygin/Downloads/Telegram\ Desktop/DataExport_02_07_2019/result.json")
    json = JSON.parse(file)
    string_messages = json["chats"]["list"][0]["messages"].filter {|m| m["text"].class == String}
    string_messages.count # 56811
    success_fetch = string_messages.filter{|m| m["text"].include?("Success fetch")}
    success_fetch.count # 22178

    result_processed_production = string_messages.filter{|m| m["text"].include?("Result processed") && !m["text"].include?("development") }; nil
    result_processed_production.count # 27557

    result_processed_production.sample
    "[production] Result processed: 100, САНКТ-ПЕТЕРБУРГ - РТИЩЕВО 1, 01.07.2019 - 01.07.2019".match(/Result processed: [0-9]+, (.*?) - (.*)[,\z]/).to_a.slice(1,2)
    "Result processed: 1, МОСКВА - ИЖЕВСК".match(/Result processed: [0-9]+, (.*?) - (.*),?/).to_a.slice(1,2)
    result_processed_routes = result_processed_production.map {|m| m["text"].match(/Result processed: [0-9]+, (.*?) - (.*),?/).to_a.slice(1,2)}; nil
    result_processed_routes.compact!
    result_processed_routes.sample

    just_success_fetch = success_fetch.filter {|m| !m["text"].include?('ActionController')}
    just_success_fetch.sample
    "Success fetch\nСАНКТ-ПЕТЕРБУРГ ХЕЛЬСИНКИ 2017-07-08 Result: FOUND".match(/Success fetch\n(.*?) (.*) [0-9]+/).to_a.slice(1,2)
    just_success_fetch_routes = just_success_fetch.map {|m| m["text"].match(/Success fetch\n(.*?) (.*) [0-9]+/).to_a.slice(1,2)}
    just_success_fetch_routes.compact!
    just_success_fetch_routes

    routes = just_success_fetch_routes + result_processed_routes

    hash = Hash[routes.group_by{|x|x}.map{|k,v| [k,v.size]}]
    sorted_hash = hash.sort_by {|route, count| count }.reverse
    puts sorted_hash.map {|a| a.flatten.join(' ')}.join("\n")

    more_than_20 = sorted_hash.filter {|r, c| c > 20}
    cities_more_than_20 = more_than_20.flatten.filter{|c| c.class == String}.uniq
    cities_more_than_20_not_in_db = cities_more_than_20.filter {|c| City.where(caps_name: c).none?}
    more_than_20_not_in_db = more_than_20.filter {|r| City.where(caps_name: r[0][0]).none? || City.where(caps_name: r[0][1]).none?}

    File.open(Rails.root.join('TelegramRoutes'), 'w') {|f|
      more_than_20_not_in_db.each {|r|
        f.write("#{r[0][0]} -> #{r[0][1]}\n")
      }
    }
  end

  def cities_for_db_from_telegram
    City.create! name: 'Кисловодск', caps_name: 'КИСЛОВОДСК', code: 2064050
    City.create! name: 'Нестеров', caps_name: 'НЕСТЕРОВ', code: 2058434
    City.create! name: 'Минск', caps_name: 'МИНСК', code: 2100000
    City.create! name: 'Хельсинки', caps_name: 'ХЕЛЬСИНКИ', code: 1000001
    City.create! name: 'Кемь', caps_name: 'КЕМЬ', code: 2004720
    City.create! name: 'Анапа', caps_name: 'АНАПА', code: 2064188
    City.create! name: 'Адлер', caps_name: 'АДЛЕР', code: 2064150
    City.create! name: 'Прага', caps_name: 'ПРАГА ГЛ.', code: 5457076
    City.create! name: 'Киев', caps_name: 'КИЕВ', code: 2200000
    City.create! name: 'Новый Уренгой', caps_name: 'НОВЫЙ УРЕНГОЙ', code: 2030319
    City.create! name: 'Берлин', caps_name: 'БЕРЛИН', code: 8000101
    City.create! name: 'Чернышевское', caps_name: 'ЧЕРНЫШЕВСКОЕ', code: 2058034
    City.create! name: 'Варшава', caps_name: 'ВАРШАВА', code: 5199136
    City.create! name: 'Ницца', caps_name: 'НИЦЦА', code: 8700400
    City.create! name: 'Вильнюс', caps_name: 'ВИЛЬНЮС', code: 2400000
    City.create! name: 'Рига', caps_name: 'РИГА', code: 2500000
    City.create! name: 'Лабытнанги', caps_name: 'ЛАБЫТНАНГИ', code: 2010180
    City.create! name: 'Милан', caps_name: 'МИЛАН РОГОРЕДО', code: 8300157
  end

  def check_popular_cities
    cities = [
      {name: 'Москва', code: 2000000},
      {name: 'Санкт-Петербург', code: 2004000},
      {name: 'Волгоград', code: 2020500},
      {name: 'Нижний Новгород', code: 2060001},
      {name: 'Астрахань', code: 2020600},
      {name: 'Самара', code: 2024000},
      {name: 'Сочи', code: 2064130},
      {name: 'Мурманск', code: 2004200},
      {name: 'Екатеринбург', code: 2030000},
      {name: 'Санкт-Петербург', code: 2004000},
      {name: 'Москва', code: 2000000},
      {name: 'Нижний Новгород', code: 2060001},
      {name: 'Казань', code: 2060615},
      {name: 'Мурманск', code: 2004200},
      {name: 'Волгоград', code: 2020500},
      {name: 'Калининград', code: 2058000},
      {name: 'Самара', code: 2024000},
      {name: 'Нестеров', code: 2058434},
      {name: 'Хабаровск', code: 2034000},
      {name: 'Сочи', code: 2064130},
    ]
    cities.map {|r| a = City.find_by_name(r[:name]); a.nil? ? "Not found: #{r[:name]}" : (a.code.to_s == r[:code].to_s || "Wrong: #{r[:name]}")}
  end

  def generate_statics_for_yandex(initial_path=nil, threads=1)
    paths = JSON.parse(File.read(Rails.root.join('paths.json')))
    start = initial_path ? paths.index(initial_path) : 0
    options = Selenium::WebDriver::Chrome::Options.new(args: [])
    drivers = threads.times.map { Selenium::WebDriver.for(:chrome, options: options)}

    Parallel.each(paths[start..-1], in_threads: threads) do |path|
        puts "worker: #{Parallel.worker_number}"
      driver = drivers[Parallel.worker_number]
      puts path
      parts = path.split('/')
      driver.get("http://localhost:5000/#{parts[1..3].join('/')}")
      tries = 0
      while driver.find_elements(:class => "itemTr").count < 10
        puts driver.find_elements(:class => "itemTr").count
        tries += 1
        if tries > 50
          raise 'WTF'
        end
        sleep(1)
      end
      # driver.find_elements(xpath: "//*[contains(text(), 'Купить')]", count: 3).first
      folder = Rails.root.join('generated_pages', parts[1..2].join('/'))
      FileUtils.mkdir_p(folder) unless File.exists?(folder)
      File.write(Rails.root.join('generated_pages', "#{parts[1..3].join('/')}.html"), driver.page_source)
    end
  ensure
    drivers.each {|d| d.quit}
  end

  def paths_from_sitemap
    doc = File.open("../public/pupadupa.xml") { |f| Nokogiri::XML(f) }
    arr = doc.css('loc').map {|loc| loc.children[0].to_s.gsub('https://www.strelchka.ru', '')}
    File.open('paths.json', 'w') {|f| f.write(arr.inspect)}
  end
end
