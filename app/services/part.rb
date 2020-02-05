require_dependency 'car'
class Part
  attr_reader :train_name, :departure, :arrival, :journey_time, :brand, :cars, :date
  def initialize(raw_data)
    raw_data = raw_data.kind_of?(Array) ? raw_data[0] : raw_data
    @train_name = raw_data["number"]
    @departure = raw_data["time0"]
    @arrival = raw_data["time1"]
    @journey_time = raw_data["timeInWay"]
    @brand = raw_data["brand"]
    @date = raw_data["date0"]
    @cars = raw_data["cars"].map do |car|
      Car.new type: car["type"], full_type: car["typeLoc"], price: car["tariff"], free_seats: car["freeSeats"], disabled_person: car["disabledPerson"]
    end
  end

  def cheapest_by_type
    cars_by_type = cars.group_by(&:type)

    cars_by_type.each do |type, cars|
      cars_by_type[type] = cars.min
    end

    return cars_by_type
  end
end
