require_dependency 'result'
class StrelochkaController < ApplicationController
  rescue_from UnsufficientParams, with: :render_error

  def index
    # render status: 503 if (rand > 0.7)
    # raise HTTP::Error if (rand > 0.7)
    params[:md] = params[:md] == "true" ? true : false
    # result = Rails.cache.fetch("ba1cken12d9#{params[:dates].to_s}#{params[:md].to_s}", expires_in: 12.hours) do
    #   FetchTickets.new.process_request(params)
    # end
    result = FetchTickets.new.process_request(params)
    render body: result
  rescue Timeout::Error, Errno::ECONNREFUSED, Errno::ECONNRESET, HTTP::Error, SocketError => e
    exception = Exception.new('RZD Fetch error')
    exception.set_backtrace(e.backtrace)
    Rollbar.scope(fingerprint: 'rzd-fetch-error').error(exception, from: params[:from_string], to: params[:to_string], date: params[:dates], original_error: e, rake_task: Rake.application.top_level_tasks)
    render status: 400, json: {result: :error, error: e, date: params["dates"]}
  end

  def create
    message = "[#{Rails.env}] Request processed: #{params[:count]}, #{params[:fromString]} - #{params[:toString]}, #{params[:fromDate]} - #{params[:toDate]}, #{params[:timing].to_f.round(2)} c.,#{params[:md] ? ' пер' : ''}"
    NotifyJob.perform_now(escape_markdown(message), "TelegramBot")
    head :no_content
  end

  def escape_markdown(string)
    string.gsub!('*', '\*')
    string.gsub!('[', '\[')
  end
end
