class AdminController < ApplicationController
  include ActionController::HttpAuthentication::Basic::ControllerMethods
  http_basic_authenticate_with name: ENV["ADMIN_LOGIN"], password: ENV["ADMIN_PASSWORD"]

  def index
    @demanded_strelochkas = Strelochka.demanded
    @demands = @demanded_strelochkas.map {|s| s.demand }.uniq
    @demands_by_email = @demands.map {|d| {email: d.email, discard_token: d.discard_token, strelochkas: d.strelochkas, id: d.id} }
    @strelochkas_today = Strelochka.where('created_at > ?', DateTime.now.beginning_of_day)
    @requests_today = @strelochkas_today.select('distinct request_uid')
    @top_request = @requests_today.select('count (id) as count, from_string, to_string').group('request_uid, from_string, to_string').reorder('count desc').first
    @users = User.order(created_at: :desc).all
  end
end
