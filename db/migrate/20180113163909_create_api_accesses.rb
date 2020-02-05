class CreateApiAccesses < ActiveRecord::Migration[5.0]
  def change
    create_table :api_accesses do |t|
      t.string :key

      t.timestamps
    end
  end
end
