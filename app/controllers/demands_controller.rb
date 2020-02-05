class DemandsController < ApplicationController
  def create
    demand = Demand.create! dates: params[:dates], email: params[:email], from_code: params[:from_code], to_code: params[:to_code], from_string: params[:from_string], to_string: params[:to_string], md: params[:md]
    DemandJob.perform_later(demand.id)
    NotifyJob.perform_later("Demand received: #{demand.email}", "DemandBot")
    render json: {id: demand.id}
  end

  def discard
    demand = Demand.find_by(discard_token: params[:token])
    demand.update(discarded_at: Time.now)
    NotifyJob.perform_later("Demand discarded: #{demand.email}", "DemandBot")
  end
end
