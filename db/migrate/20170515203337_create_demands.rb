class CreateDemands < ActiveRecord::Migration[5.0]
  def change
    create_table :demands do |t|
      t.string :uid
      t.string :email

      t.timestamps
    end
  end
end
