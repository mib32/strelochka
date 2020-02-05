class Demand < ApplicationRecord
  has_secure_token :discard_token
  validates_presence_of :from_code, :to_code, :from_string, :to_string, :dates, :email
  validates_numericality_of :from_code, :to_code

  def self.active
    Demand.find_by_sql(["select distinct id from (select id, to_date(unnest(dates), 'YYYY-MM-DD') as date from demands where discarded_at is null ) t where date > to_date(?, 'YYYY-MM-DD')", Date.today])
  end
end
