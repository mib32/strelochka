class SuperDemandsController < ApplicationController
  def discard
    @demand = SuperDemand.find_by(discard_token: params[:token])
    @demand.update(discarded_at: Time.now)
    NotifyJob.perform_later("Super Demand discarded: #{@demand.email}", "DemandBot")
  end
end
