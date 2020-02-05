require_dependency 'part'
class Journey
  attr_reader :parts, :duration, :duration_human
  def self.parse(raw_data)
    if raw_data
      raw_data.map {|journey| new(journey)}
    else
      []
    end
  end

  def initialize(journey)
    if journey["cases"]
      @parts = journey["cases"].map {|part| Part.new(part)}
      @duration = journey["totalTravelTime"]
      @duration_human = minstohhmm(journey["totalTravelTime"])
    else
      @parts = [Part.new(journey)]
      @duration = hhmmtomins(@parts[0].journey_time)
      @duration_human = journey["totalTravelTime"]
    end
  end

  def hhmmtomins(hhmm)
    h, m = hhmm.split(':').map(&:to_i)
    return h * 60 + m
  end

  def minstohhmm(minutes)
    return [minutes/60, minutes % 60].map{|v| v.to_s.ljust(2, "0")}.join(':')
  end
end
