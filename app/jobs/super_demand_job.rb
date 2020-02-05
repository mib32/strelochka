require 'sendgrid-ruby'

class SuperDemandJob < ApplicationJob
  queue_as :default

  def perform(id)
    route = PopularRoute.find(id)
    if route.averages.present?
      result = route_results(route)
      prices = result.select {|r| r.result.present?}.map {|r| [r.date, TimeTable.create(r.result, r.date).short]}
      low_prices = prices.map do |date, day|
        [date, day.select do |car_type, price|
          ((route.averages[car_type] - price).fdiv(route.averages[car_type]) >= 0.5)
        end]
      end.filter {|date, low_prices| low_prices.present?}

      route.super_demands.each do |demand|
        demand_low_prices = low_prices.map {|date, day| [date.iso8601, day.filter {|car_type, price| CrazyPrice.none_and_create?(route, demand, price, car_type, date)}]}.filter {|date, low_prices| low_prices.present?}
        if demand_low_prices.any?
          GeneralMailer.superdemand_email(route, demand, demand_low_prices).deliver_later
          NotifyJob.perform_later("Superdemand sent to #{demand.email}", "DemandBot")
        end
      end
    else
      Rails.logger.debug('Skipping demand - no averages yet')
    end
  end

  def populate_popular_routes
    ["Москва", "Санкт-Петербург",
    "Санкт-Петербург", "Москва",
    "Москва", "Нижний Новгород",
    "Нижний Новгород", "Москва",
    "Анапа", "Москва",
    "Москва", "Анапа",
    "Москва", "Казань",
    "Казань", "Москва",
    "Краснодар", "Сочи",
    "Краснодар", "Адлер",
    "Москва", "Воронеж",
    "Сочи", "Краснодар",
    "Адлер", "Краснодар",
    "Москва", "Владимир",
    "Воронеж", "Москва",
    "Москва", "Брянск",
    "Москва", "Ярославль",
    "Новороссийск", "Москва",
    "Москва", "Белгород",
    "Москва", "Новороссийск",
    "Ярославль", "Москва",
    "Владимир", "Москва",
    "Москва", "Саратов",
    "Брянск", "Москва",
    "Москва", "Киев"].each_slice(2) do |from, to|
      PopularRoute.create! from_city: City.find_by_name(from), to_city: City.find_by_name(to)
    end
  end

  def route_results(route)
    FetchTickets.new.process_dates(Date.today..Date.today+Settings.superdemand_days_count, {
      from_code: route.from_code,
      to_code: route.to_code,
      from_string: route.from_string,
      to_string: route.to_string,
      md: route.md
    })
  end

  def find_averages
    PopularRoute.all.each do |route|
      result = route_results(route)
      prices = result.select {|r| r.result.present?}.map {|r| TimeTable.create(r.result, r.date).short}
      car_types = prices.map {|day| day.keys}.flatten.uniq
      averages = Hash[car_types.map do |car_type|
        car_type_prices = prices.filter {|day| day[car_type].present?}
        [car_type, (car_type_prices.reduce(0) {|sum, day| day[car_type] + sum}.to_f / car_type_prices.size).round]
      end]
      route.update averages: averages
    end
  end
end
