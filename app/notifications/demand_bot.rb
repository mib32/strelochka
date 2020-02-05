class DemandBot < Bot
  include Singleton

  def initialize
    super(token: Settings.telegram.demand_bot_token, chat_id: Settings.telegram.chat_id)
  end
end
