json.array! @response do |item|
  json.name item["n"]
  json.code item["c"]
  json.sort item["S"]
  json.l    item["L"]
  json.ss   item["ss"]
end
