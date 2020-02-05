class ApplicationJob < ActiveJob::Base
  class << self
    def perform_now_or_later *args
      if Rails.env.development?
        perform_now *args
      else
        perform_later *args
      end
    end
  end
end
