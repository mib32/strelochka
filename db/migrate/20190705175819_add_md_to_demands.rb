class AddMdToDemands < ActiveRecord::Migration[5.0]
  def change
    add_column :demands, :md, :boolean
  end
end
