require_dependency 'strelochka'
class FetchTickets
  def initialize()
  end

  def log *args
    # Rails.logger.debug "!!! ~~~--- #{args.join(' ')} ---~~~ !!!"
  end

  def process_demand(demand)
    result = process_dates(demand.dates, {
      from_code: demand.from_code,
      to_code: demand.to_code,
      from_string: demand.from_string,
      to_string: demand.to_string,
      md: demand.md
    })
    generate_timetables = result.map {|r| [r.date, TimeTable.create(r.result, r.date)]}
    Hash[*generate_timetables.flatten(1)]
  end

  def process_request(params)
    dates = if params[:dates] == 'bulk'
      Date.today..(Date.today+10)
    else
      if !params[:dates].is_a? Array
        [params[:dates]]
      end
    end

    process_dates(dates, params)
  end

  def process_dates(dates, params)
    results = Parallel.map(dates, in_threads: Settings.fetch_thread_count) do |date|
      fetch(
        date: date,
        from: params[:from_code],
        to: params[:to_code],
        md: params[:md],
      )
    end

    return results
  end

  def retriable_options
    {
      on: [Timeout::Error, Errno::ECONNRESET, SocketError, HTTP::Error],
      tries: 10,
      base_interval: 0.2,
      multiplier: 1.0,
      on_retry: Proc.new { |exception, try, elapsed_time, next_interval| puts("#{exception.class}: '#{exception.message}' - #{try} tries in #{elapsed_time} seconds and #{next_interval} seconds until the next try.") }
    }
  end

  # This method returns stringified json by convention
  def fetch(date:, from:, to:, md: false)
    Retriable.retriable(retriable_options) do
      date = (date.kind_of?(Date) ? date : Date.parse(date)).strftime('%d.%m.%Y')
      url = "https://pass.rzd.ru/timetable/public/ru?layer_id=5827"
      rid, cookie, tickets = nil
      parser = Yajl::Parser.new
      log from, to, date
      loop do
        log 'GET RID AND COOKIE'
        response = HTTP.timeout(20).post(url, form: {version: 2, actorType: 'desktop_2016', dir: 0, tfl: 3, code0: from, code1: to, dt0: date, checkSeats: 1, md: (md ? 1 : 0)})
        raise HTTP::Error.new() if response.body.to_s.include?('Произошла внутре')
        parsed_response = parser.parse(response.body.to_s)

        # log "RESP: ", parsed_response["result"]
        case parsed_response["result"]
        when "RID", "OK"
          if parsed_response["RID"]
            rid = parsed_response["RID"]
            cookie = response.headers[:set_cookie]
          elsif parsed_response["tp"]
            return response.body.to_s.gsub("\n\n\n\n\n", "")
          end
          break
        when 'FAIL'
          log 'FAIL GET COKIE'
          raise UnsufficientParams.new(message: 'Неверная дата.')
        end
      end

      sleep(1)

      loop do
        log 'START GET THE RESULT'
        response = HTTP.timeout(10).headers(cookie: cookie.map {|c| c.split(';').first}.join('; ')).post(url, form: {rid: rid})
        body = response.body.to_s
        # log body
        if body.start_with?("\n\n\n\n\n{\"result\":\"OK\"")
          # byebug
          body[0..4] = ''
          return body
        elsif body.start_with?("\n\n\n\n\n{\"result\":\"Error\"")
          Rails.logger.error('RZD Error')
          raise HTTP::Error
        elsif body.start_with?("\n\n\n\n\n{\"result\":\"FAIL\"")
          Rails.logger.error('RZD FAIL')
          raise HTTP::Error
        elsif body.start_with?("\n\n\n\n\n{\"result\":\"RID\"")
          sleep(1)
        end
      end
    end
  end
end
