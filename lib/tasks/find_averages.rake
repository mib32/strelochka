task :find_averages => :environment do
  puts "#{Time.now.getutc} Starting find_averages task..."

  SuperDemandJob.new.find_averages

  puts "#{Time.now.getutc} Finished find_averages task."
end
