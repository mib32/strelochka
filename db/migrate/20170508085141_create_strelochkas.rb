class CreateStrelochkas < ActiveRecord::Migration[5.0]
  def change
    create_table :strelochkas do |t|
      t.string :from_code
      t.string :from_string
      t.string :to_code
      t.string :to_string
      t.date :date
      t.json :result
      t.string :request_id

      t.timestamps
    end
  end
end
