class CreateRestarts < ActiveRecord::Migration[5.2]
  def change
    create_table :restarts do |t|

      t.timestamps
    end
  end
end
