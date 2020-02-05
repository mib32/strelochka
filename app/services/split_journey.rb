class SplitJourney
  attr_reader :journey_time

  def initialize(raw_data)
    @raw_data = raw_data || []
    @raw_cases = @raw_data["cases"]
    @departure_time = @raw_cases[0][0]["time0"]
    @arrival_time = @raw_cases[0][0]["time1"]
    @journey_time = "#{@raw_data["totalTravelTime"] / 60}:#{@raw_data["totalTravelTime"] % 60}"
    @brand = 'Составной'
    @name = @raw_cases[0][0]["number"]
  end

  def cases
    @cases ||= @raw_cases.map do |train|
      train = train[0]
      Train.new name: train["number"], departure_time: train["time0"], arrival_time: train["time1"], journey_time: train["timeInWay"], brand: train["brand"], cars_data: train["cars"]
    end
  end

  def all_cases_have_tickets?
    cases.all? {|c| c.cars.any? }
  end

  def all_cases_have_type?(car_type)
    cases.all? {|c| c.cars.any? {|car| car.type == car_type}}
  end

  def price
    cases.sum{|c| c.cars.min.price}
  end

  def for_type(car_type)
    OpenStruct.new(price: cases.sum {|c| c.cars.filter {|car| car.type == car_type}.min.price}, free_seats: nil, train: cases.first)
  end
end
