require_dependency 'train'
class TimeTable
  def self.create(raw_data, date, arrive_time=nil, depart_time=nil)
    if raw_data.first && raw_data.first["cases"]
      SplitTimeTable.new(raw_data, date, arrive_time, depart_time)
    else
      self.new(raw_data, date, arrive_time, depart_time)
    end
  end

  def initialize(raw_data, date, arrive_time, depart_time)
    @raw_data = raw_data || []
    @date = date
    @arrive_time = arrive_time
    @depart_time = depart_time
  end

  def date
    @date.strftime('%d.%m.%Y')
  end

  def trains
    @trains ||= @raw_data.map do |train|
      Train.new name: train["number"], departure_time: train["time0"], arrival_time: train["time1"], journey_time: train["timeInWay"], brand: train["brand"], cars_data: train["cars"]
    end
  end

  def not_sapsan_cars
    trains.select {|t| t.brand != 'САПСАН'}.map {|train| train.cars }.flatten
  end

  def sapsan_cars
    trains.select {|t| t.brand == 'САПСАН'}.map {|train| train.cars }.flatten
  end

  def filter_cars(cars)
    cars.select do |car|
      in_time?(car.train.departure_time, car.train.arrival_time)
    end
  end

  def in_time?(departure_time, arrival_time)
    departure_h, departure_m = departure_time.split(':').map(&:to_i)
    departure = departure_h * 60 + departure_m
    departure_fits = @depart_time.nil? ? true : departure.in?(Range.new(*@depart_time.map(&:to_i)))

    arrival_h, arrival_m = arrival_time.split(':').map(&:to_i)
    arrival = arrival_h * 60 + arrival_m
    arrival_fits = @arrive_time.nil? ? true : arrival.in?(Range.new(*@arrive_time.map(&:to_i)))

    departure_fits && arrival_fits
  end

  def cheapest_by_type_and_sapsan
    cars_by_type = filter_cars(not_sapsan_cars).group_by(&:type)

    cars_by_type.each do |type, cars|
      cars_by_type[type] = cars.min
    end

    sc = filter_cars(sapsan_cars)

    if sc.min
      cars_by_type["Сапсан"] = sc.min
    end

    return cars_by_type
  end

  def short()
    Hash[self.cheapest_by_type_and_sapsan.map {|k, v| [k, v.price]}]
  end

  def as_json(options={})
    Hash[*self.cheapest_by_type_and_sapsan.map {|k, v| [k, v.price]}.flatten]
  end
end
