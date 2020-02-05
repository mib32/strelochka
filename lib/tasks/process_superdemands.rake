task :process_superdemands => :environment do
  puts "#{Time.now.getutc} Starting super demands task..."

  PopularRoute.demanded.each {|pr| puts pr.id; SuperDemandJob.perform_now(pr.id) }

  puts "#{Time.now.getutc} Finished super demands task."
end
