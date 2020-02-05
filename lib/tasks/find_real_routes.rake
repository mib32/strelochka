task :find_real_routes => :environment do
  puts "#{Time.now.getutc} Starting find_real_routes task..."

  FindRealRoutesJob.perform_now

  puts "#{Time.now.getutc} Finished find_real_routes task."
end
