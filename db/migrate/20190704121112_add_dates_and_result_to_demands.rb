class AddDatesAndResultToDemands < ActiveRecord::Migration[5.0]
  def change
    add_column :demands, :dates, :string, array: true
    add_column :demands, :result, :json
    add_column :demands, :from_code, :string
    add_column :demands, :to_code, :string
    add_column :demands, :from_string, :string
    add_column :demands, :to_string, :string
    remove_column :demands, :uid, :string

    remove_column :strelochkas, :request_uid, :string
  end
end
