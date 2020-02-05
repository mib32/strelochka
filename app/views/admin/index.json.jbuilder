json.demands @demands do |demand|
  json.extract! demand, :id, :uid
end
json.demanded_strelochkas @demanded_strelochkas do |strelochka|
  json.extract! strelochka, :id, :request_uid, :from_string, :to_string
end
json.by_email @demands_by_email do |demand|
  json.extract! demand, :id, :email, :discard_token, :strelochkas
end
json.strelochkas_today @strelochkas_today.count
json.requests_today @requests_today.count
json.top_request @top_request
json.users @users
