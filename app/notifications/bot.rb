require 'telegram/bot'

class Bot
  attr_reader :bot
  def initialize(token:, chat_id:)
    @bot = Telegram::Bot::Client.new(token)
    @chat_id = chat_id
  end

  def send title, *args
    if Rails.env.development?
      Rails.logger.debug([title, args.join(' ')].join("\n"))
    else
      @bot.api.sendMessage text: [title, args.join(' ')].join("\n"), chat_id: @chat_id, disable_web_page_preview: true, parse_mode: 'Markdown'
    end
  end
end
