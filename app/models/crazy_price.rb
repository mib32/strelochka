class CrazyPrice < ApplicationRecord
  validates_presence_of :price, :car_type
  belongs_to :route, foreign_key: :popular_route_id, class_name: 'PopularRoute'
  belongs_to :super_demand

  def self.none_and_create?(route, demand, price, car_type, date)
    params = {route: route, price: price, super_demand: demand, car_type: car_type, date: date}
    none = self.where(params).none?
    if none
      self.create(params)
    end

    return none
  end
end
