require_dependency 'time_table'
require_dependency 'journey'
class Strelochka
  attr_accessor :date, :errored, :result, :error, :journeys

  def initialize(date:, result:)
    @date = date
    @result = if result.kind_of?(Array)
      result
    elsif result.kind_of?(Hash) && result[:status] == :error
      @errored = true
      nil
    end
  end

  def errored?
    errored
  end

  def done?
    !result.nil?
  end

  def time_table
    @time_table ||= TimeTable.create(self.result, self.date, self.arrive_time, self.depart_time).cheapest_by_type_and_sapsan
  end

  def journeys
    @journeys ||= Journey.parse(@result)
  end

  def date
    @date.is_a?(Date) ? @date.strftime('%d.%m.%Y') : @date
  end
end
