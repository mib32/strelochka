class AddCarTypeToCrazyPrices < ActiveRecord::Migration[5.0]
  def change
    add_column :crazy_prices, :car_type, :string
  end
end
