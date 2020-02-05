class RestartController < ApplicationController
  def index
    render json: { available: available? }
  end

  def create
    if available?
      heroku = PlatformAPI.connect_oauth(ENV["PLATFORM_TOKEN"])
      heroku.dyno.restart(Settings.dyno_restart_app_name, 'web')
      Restart.create()
    end
  end

  private
  def available?
    today_restarts = Restart.where("created_at > ?", DateTime.now.beginning_of_day)
    today_restarts.none?
  end
end
