class PopularRoute < ApplicationRecord
  belongs_to :from_city, class_name: 'City', foreign_key: 'from_city_id'
  belongs_to :to_city, class_name: 'City', foreign_key: 'to_city_id'
  has_many :super_demands

  def self.demanded
    self.joins(:super_demands).where("super_demands.discarded_at is null").group('popular_routes.id').having('count(popular_route_id) > 0')
  end

  def self.create_demand(email)
    self.all.each {|r| SuperDemand.create email: email, popular_route_id: r.id}
  end

  def from_code
    from_city.code
  end

  def from_string
    from_city.name
  end

  def to_code
    to_city.code
  end

  def to_string
    to_city.name
  end
end
