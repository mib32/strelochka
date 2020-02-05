require_dependency 'car'
class Train
  attr_reader :name, :departure_time, :journey_time, :brand, :arrival_time

  def initialize(name: nil, departure_time: nil, arrival_time: nil, journey_time: nil, cars_data: nil, brand: nil)
    @name = name
    @departure_time = departure_time
    @arrival_time = arrival_time
    @journey_time = journey_time
    @brand = brand
    @cars_data = cars_data
    @cars = @cars_data.map do |car|
      Car.new type: car["type"], full_type: car["typeLoc"], price: car["tariff"], free_seats: car["freeSeats"], train: self, disabled_person: car["disabledPerson"]
    end
  end

  def not_disabled_cars
    @cars.select {|car| !car.disabled_person }
  end

  def cars
    not_disabled_cars
  end

  def to_json
    {name: @name, departure_time: @departure_time, journey_time: @journey_time, brand: @brand}.to_json
  end
end
