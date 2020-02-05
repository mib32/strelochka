class CreateCrazyPrices < ActiveRecord::Migration[5.0]
  def change
    create_table :crazy_prices do |t|
      t.integer :price
      t.date :date
      t.string :from_code
      t.string :to_code
      t.string :email

      t.timestamps
    end
  end
end
