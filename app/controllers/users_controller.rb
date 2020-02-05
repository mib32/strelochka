class UsersController < ApplicationController
  def create
    User.create email: params[:email]
    redirect_to '/'
  end
end
