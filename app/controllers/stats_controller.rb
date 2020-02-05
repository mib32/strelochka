class StatsController < ApplicationController
  def save
    SearchLog.create permitted_params
  end

  private def permitted_params
    params.permit(:to, :from, :to_string, :from_string, :dates_string)
  end
end
