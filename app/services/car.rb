class Car
  include Comparable
  attr_reader :type, :full_type, :price, :free_seats, :train, :disabled_person

  def initialize(type: nil, full_type: nil, price: nil, free_seats: nil, train: nil, disabled_person: nil)
    @type = type
    @full_type = full_type
    @price = price
    @free_seats = free_seats
    @train = train
    @disabled_person = disabled_person
  end

  def <=> other
    if self.price.to_i == 0
      return 1
    else
      self.price <=> other.price
    end
  end
end
