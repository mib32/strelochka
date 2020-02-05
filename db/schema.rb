# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_10_17_173253) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", id: :serial, force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.integer "resource_id"
    t.string "author_type"
    t.integer "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "admin_users", id: :serial, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "api_accesses", id: :serial, force: :cascade do |t|
    t.string "key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "cities", id: :serial, force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.string "caps_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "crazy_prices", id: :serial, force: :cascade do |t|
    t.integer "price"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "popular_route_id"
    t.integer "super_demand_id"
    t.string "car_type"
    t.index ["popular_route_id"], name: "index_crazy_prices_on_popular_route_id"
    t.index ["super_demand_id"], name: "index_crazy_prices_on_super_demand_id"
  end

  create_table "demands", id: :serial, force: :cascade do |t|
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "discard_token"
    t.datetime "discarded_at"
    t.string "dates", array: true
    t.json "result"
    t.string "from_code"
    t.string "to_code"
    t.string "from_string"
    t.string "to_string"
    t.boolean "md"
  end

  create_table "popular_routes", id: :serial, force: :cascade do |t|
    t.string "email"
    t.integer "from_city_id"
    t.integer "to_city_id"
    t.boolean "md"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.json "averages"
    t.index ["from_city_id"], name: "index_popular_routes_on_from_city_id"
    t.index ["to_city_id"], name: "index_popular_routes_on_to_city_id"
  end

  create_table "restarts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "search_logs", id: :serial, force: :cascade do |t|
    t.string "from"
    t.string "to"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "from_string"
    t.string "to_string"
    t.string "dates_string"
  end

  create_table "super_demands", id: :serial, force: :cascade do |t|
    t.string "email"
    t.datetime "discarded_at"
    t.string "discard_token"
    t.integer "popular_route_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["popular_route_id"], name: "index_super_demands_on_popular_route_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "values", id: :serial, force: :cascade do |t|
    t.integer "donate"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "crazy_prices", "super_demands"
end
