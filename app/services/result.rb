CAR_TYPE_SORTING_ARR = [
  'Мягкий',
  'Люкс',
  'Купе',
  'Плац',
  'Общий',
  'Сид',
  'Сапсан',
  'Микс'
]

class Result
  attr_reader :strelochkas, :from_string, :to_string, :from_code, :to_code, :md, :arrive_time, :depart_time
  def initialize(results, dates, params)
    @results = results
    @dates = dates
    @from_string = params[:from_string]
    @to_string = params[:to_string]
    @from_code = params[:from_code]
    @to_code = params[:to_code]
    @arrive_time = params[:arrive_time]
    @depart_time = params[:depart_time]
    @md = params[:md]
  end

  def car_types
    car_types = strelochkas.map do |strelochka|
      strelochka.journeys.map do |journey|
        journey.parts.map do |part|
          if part.brand == "САПСАН"
            'Сапсан'
          else
            part.cars.map {|car| car.type}
          end
        end
      end
    end.flatten.uniq

    car_types.push('Микс') if @md
    return car_types
  end

  def sorted_car_types
    car_types.sort {|a, b| CAR_TYPE_SORTING_ARR.index(b) - CAR_TYPE_SORTING_ARR.index(a)}
  end

  def durations
    strelochkas.map do |strelochka|
      strelochka.journeys.map do |journey|
        journey.duration
      end
    end.flatten.uniq
  end

  def strelochkas
    @strelochkas ||= @results.map.with_index {|r, i| Strelochka.new(result: r, date: @dates[i])}
  end

  def sorted_durations
    durations.sort {|a, b| a-b}
  end

  def to_json
    {
      sorted_car_types: sorted_car_types,
      sorted_durations: sorted_durations,
      results: strelochkas.map do |strelochka|
        if strelochka.errored?
          {
            status: 'failed',
            date: strelochka.date
          }
        else
          {
            date: strelochka.date,
            from_string: self.from_string,
            to_string: self.to_string,
            from_code: self.from_code,
            to_code: self.to_code,
            md: self.md,
            journeys: strelochka.journeys.map do |journey|
              {
                duration: journey.duration,
                duration_human: journey.duration_human,
                parts: journey.parts.map do |part|
                  {
                    train_name: part.train_name,
                    departure_time: part.departure,
                    arrival_time: part.arrival,
                    journey_time: part.journey_time,
                    cars: part.cars.map do |car|
                      {
                        type: car.type,
                        full_type: car.full_type,
                        price: car.price,
                        free_seats: car.free_seats,
                        train: car.train,
                        disabled_person: car.disabled_person
                      }
                    end,
                    brand: part.brand
                  }end
              }end
          }end
      end
    }
  end
end
