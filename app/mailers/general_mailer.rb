class GeneralMailer < ApplicationMailer
  default :from => 'Стрелочка <strelochka@strelchka.ru>'

  def demand_email(demand, timetables)
    @demand, @timetables = demand, timetables.sort_by {|arr| Date.parse(arr[0])}

    mail({
      to: @demand.email,
      subject: "Стрелочка >>> На билеты понизились цены!"
    })
  end

  def superdemand_email(route, demand, low_prices)
    @route, @demand, @low_prices = route, demand, low_prices

    mail({
      to: @demand.email,
      subject: "Стрелочка >>> Суперзапрос #{@route.from_string} - #{@route.to_string}"
    })
  end

  def feedback_email(feedback)
    @feedback = feedback
    mail({
      to: "mibus32@gmail.com",
      subject: "Стрелочка >>> Отзыв"
    })
  end
end
