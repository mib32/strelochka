class Value < ApplicationRecord
  class << self
    def donate
      Value.last.donate
    end

    def donate= v
      Value.last.update donate: v
    end
  end
end
