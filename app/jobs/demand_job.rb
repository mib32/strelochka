require 'sendgrid-ruby'

class DemandJob < ApplicationJob
  queue_as :default

  def perform(id)
    demand = Demand.find(id)
    if demand.result.nil?
      result = FetchTickets.new.process_demand(demand)
      demand.update result: result
    else
      new_timetables = FetchTickets.new.process_demand(demand)
      timetables = demand.result.filter {|d, t| Date.parse(d) > Date.today}.map do |date, old_timetable|
        new_timetable = new_timetables[date].cheapest_by_type_and_sapsan

        diffs = old_timetable.keys.map do |key|
          if old_timetable[key] && new_timetable[key]
            diff = new_timetable[key].price - old_timetable[key]
          else
            diff = 0
          end
          [key, diff]
        end

        lowered = diffs.select {|diff| diff[1] < 0 }
        [date, old_timetable, new_timetable, lowered]
      end


      if (timetables.any? {|d, o, n, l| l.any? })
        GeneralMailer.demand_email(demand, timetables).deliver # cannot be postponed because of OpenStruct in params
        demand.update result: new_timetables
        NotifyJob.perform_later("Email sent to #{demand.email}", "DemandBot")
      end
    end
  end
end
