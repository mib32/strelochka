class AddCacheHitToStrelochkas < ActiveRecord::Migration[5.0]
  def change
    add_column :strelochkas, :cache_hit, :boolean, default: false
  end
end
