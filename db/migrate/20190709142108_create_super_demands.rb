class CreateSuperDemands < ActiveRecord::Migration[5.0]
  def change
    create_table :super_demands do |t|
      t.string :email
      t.datetime :discarded_at
      t.string :discard_token
      t.json :result
      t.belongs_to :from_city
      t.belongs_to :to_city
      t.boolean :md

      t.timestamps
    end
  end
end
