class AddDiscardTokenToDemands < ActiveRecord::Migration[5.0]
  def change
    add_column :demands, :discard_token, :string
    add_column :demands, :discarded_at, :datetime
  end
end
