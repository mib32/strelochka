Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'home#index'
  resources :demands do
    member do
      get :discard
    end
  end

  resources :super_demands do
    member do
      get :discard
    end
  end
  resources :strelochka, only: [:index, :create]
  resources :cities, only: [:index]
  get 'fetch', to: 'strelochka#fetch'
  resources :station_codes, only: [:index]
  post 'stats', to: 'stats#save'
  post 'feedback', to: 'feedback#create'
  resources :users, only: [:create]
  get 'server_data', to: 'server_data#index'
  get 'restart', to: 'restart#index'
  post 'restart', to: 'restart#create'

  get 'admin_data', to: 'admin#index', format: 'json'
  get '*path', to: "home#index", constraints: ->(request) do
    !request.xhr? && (request.format.html? || request.format == '*/*')
  end
end
