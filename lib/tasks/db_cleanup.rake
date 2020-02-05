task :db_cleanup => :environment do
  puts "#{Time.now.getutc} Starting db cleanup task..."

  DbCleanupJob.perform_now

  puts "#{Time.now.getutc} Finished db cleanup task."
end
