class RequestJob < ApplicationJob
  queue_as :default

  def perform(params)
    strelochkas = []
    params[:dates].each do |date|
      strelochka = Strelochka.create({
        from_code: params[:from_code],
        from_string: params[:from_string],
        to_code: params[:to_code],
        to_string: params[:to_string],
        request_uid: params[:request_uid],
        date: date
      })
      strelochkas << strelochka
    end

    # threads = []
    # Thread.abort_on_exception=true
    strelochkas.map do |s|
      # threads << Thread.new {
      s.fetch
      # }
    end

    # threads.each(&:join)

    message = "Result processed: #{params[:dates].count}, #{params[:from_string]} - #{params[:to_string]}"
    NotifyJob.perform_later(message, "TelegramBot")
  end

  def permitted_params(params)
    params.permit(:from_code, :from_string, :to_code, :to_string, :request_uid)
  end
end
