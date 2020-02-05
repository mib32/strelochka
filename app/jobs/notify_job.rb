class NotifyJob < ApplicationJob
  queue_as :default

  def perform(message, bot_class)
    bot = bot_class.constantize
    bot.instance.send(*message)
  end
end
