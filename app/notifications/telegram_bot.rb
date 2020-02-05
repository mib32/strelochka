class TelegramBot < Bot
  include Singleton

  def initialize
    super(token: Settings.telegram.bot_token, chat_id: Settings.telegram.chat_id)
  end
end
