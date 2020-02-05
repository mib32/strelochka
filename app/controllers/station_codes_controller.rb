class StationCodesController < ApplicationController
  def index
    cache_name = params[:q].to_s[0..2]
    response = Rails.cache.fetch("station_codes/#{cache_name}", expires_in: 30.days) do
      Retriable.retriable(on: [Timeout::Error, Errno::ECONNRESET], tries: 5, base_interval: 1) do
        RestClient.get('https://pass.rzd.ru/suggester?'+ { stationNamePart: params[:q], compactMode: 'y', lat: '1', lang: 'ru'}.to_param).to_s
      end
    end
    if response.present?
      @response = JSON.parse(response)
    else
      @response = []
    end
  end
end
