class City < ApplicationRecord
  validates_uniqueness_of :name
end
