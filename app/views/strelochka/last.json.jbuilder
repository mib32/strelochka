json.array! @strelochkas do |strelochka|
  json.from_string strelochka.from_string
  json.to_string strelochka.to_string
  json.to_code strelochka.to_code
  json.from_code strelochka.from_code
end
