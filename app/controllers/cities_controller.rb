class CitiesController < ApplicationController

  def index
    cities = params[:cities].map {|c| City.find_by(name: c)}
    render json: cities
  end
end
