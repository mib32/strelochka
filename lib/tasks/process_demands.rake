task :process_demands => :environment do
  puts "#{Time.now.getutc} Starting demands task..."

  Demand.active.each {|d| puts d.id; DemandJob.perform_now(d.id) }

  puts "#{Time.now.getutc} Finished demands task."
end
