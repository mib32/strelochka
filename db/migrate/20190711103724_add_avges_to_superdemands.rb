class AddAvgesToSuperdemands < ActiveRecord::Migration[5.0]
  def change
    add_column :super_demands, :averages, :json
    remove_column :super_demands, :result, :json
  end
end
