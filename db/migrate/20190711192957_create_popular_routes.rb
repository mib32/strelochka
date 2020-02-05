class CreatePopularRoutes < ActiveRecord::Migration[5.0]
  def change
    rename_table :super_demands, :popular_routes
    remove_column :popular_routes, :discarded_at, :datetime
    remove_column :popular_routes, :discard_token, :string

    remove_column :crazy_prices, :email, :string
    remove_column :crazy_prices, :from_code, :string
    remove_column :crazy_prices, :to_code, :string
    add_belongs_to :crazy_prices, :popular_route

    create_table :super_demands do |t|
      t.string :email
      t.datetime :discarded_at
      t.string :discard_token
      t.belongs_to :popular_route

      t.timestamps
    end
  end
end
