class AddFromCityToSearchLogs < ActiveRecord::Migration[5.0]
  def change
    add_column :search_logs, :from_string, :string
    add_column :search_logs, :to_string, :string
    add_column :search_logs, :dates_string, :string
  end
end
