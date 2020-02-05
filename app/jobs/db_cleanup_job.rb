class DbCleanupJob < ApplicationJob
  TABLE_LIMIT = 8000
  DELETE_NUM = 3000
  queue_as :default

  def perform()
  end
end
