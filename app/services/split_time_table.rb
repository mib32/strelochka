require_dependency 'split_journey'
class SplitTimeTable < TimeTable
  def journeys
    @journeys ||= @raw_data.map do |journey|
      SplitJourney.new journey
    end.flatten
  end

  def available_journeys
    filter_journeys(journeys).filter {|j| j.all_cases_have_tickets? }
  end

  def filter_journeys(journeys)
    journeys.select do |journey|
      first_train = journey.cases.first
      last_train = journey.cases.first

      in_time?(first_train.departure_time, last_train.arrival_time)
    end
  end

  def mix_lowest_price_cars
    available_journeys.min_by {|j| j.price}
  end

  def car_type_grouped_min_journeys
    Hash[*["Сапсан", "Сид", "Плац", "Купе", "Люкс", "Мягкий"].map do |car_type|
      [car_type, available_journeys.filter {|j| j.all_cases_have_type?(car_type)}.map {|j| j.for_type(car_type)}.min_by {|j| j.price}]
    end.flatten(1)]
  end


  def cheapest_by_type_and_sapsan
    cars_by_type = car_type_grouped_min_journeys

    cars_by_type["Микс"] = mix_lowest_price_cars

    return cars_by_type.compact
  end

  def as_json(options={})
    Hash[*self.cheapest_by_type_and_sapsan.map {|k, v| [k, v.price]}.flatten]
  end
end
