class ApplicationController < ActionController::API
  private

  def render_error e
    # NotifyJob.perform_later(['Fail!s', params], "TelegramBot")
    render status: 500, json: e.data
  end
end
