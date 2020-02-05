class CreateSearchLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :search_logs do |t|
      t.string :from
      t.string :to
      t.date :date

      t.timestamps
    end
  end
end
