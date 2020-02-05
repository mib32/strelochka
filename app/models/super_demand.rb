class SuperDemand < ApplicationRecord
  has_secure_token :discard_token
  validates_presence_of :email
  belongs_to :route, foreign_key: :popular_route_id, class_name: 'PopularRoute'
end
