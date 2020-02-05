class ServerDataController < ApplicationController

  def index
    render json: {donate: Value.donate, today: Date.today}
  end
end
