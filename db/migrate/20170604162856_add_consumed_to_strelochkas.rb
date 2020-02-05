class AddConsumedToStrelochkas < ActiveRecord::Migration[5.0]
  def change
    add_column :strelochkas, :consumed, :boolean, default: false
    rename_column :strelochkas, :request_id, :request_uid
  end
end
