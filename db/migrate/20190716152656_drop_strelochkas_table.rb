class DropStrelochkasTable < ActiveRecord::Migration[5.0]
  def change
    drop_table :strelochkas
  end
end
