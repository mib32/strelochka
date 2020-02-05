class StrelochkaJob < ApplicationJob
  queue_as :default

  def perform(id)
    s = Strelochka.find(id)
    s.fetch
  end
end
