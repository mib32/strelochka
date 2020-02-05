class FeedbackController < ApplicationController
  def create
    GeneralMailer.feedback_email(params[:feedback]).deliver
  end
end
