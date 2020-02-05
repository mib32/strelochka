class AddDemandIdToCrazyPrice < ActiveRecord::Migration[5.0]
  def change
    add_reference :crazy_prices, :super_demand, foreign_key: true
  end
end
