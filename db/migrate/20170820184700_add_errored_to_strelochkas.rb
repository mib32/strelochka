class AddErroredToStrelochkas < ActiveRecord::Migration[5.0]
  def change
    add_column :strelochkas, :errored, :boolean, default: false, null: false
  end
end
