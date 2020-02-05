task :snapshot do
  puts "#{Time.now.getutc} Starting snapshot..."

  # Dir.chdir('./client')

  chrome_bin = ENV.fetch('GOOGLE_CHROME_SHIM', nil)
  chrome_opts = chrome_bin ? { binary: chrome_bin } : {}
  driver = Selenium::WebDriver.for(:chrome, options: Selenium::WebDriver::Chrome::Options.new(chrome_opts))


  # pid = Process.spawn('npx serve -p 52971 -s build')

  driver.get(Settings.app_domain)
  element_finder, count = [Proc.new { driver.find_elements(:id => "goButton").count }, 1]

  tries = 0
  while element_finder.call() < count
    puts element_finder.call()
    tries += 1
    if tries > 50
      raise 'WTF'
    end
    sleep(1)
  end

  FileUtils.mv('./client/build/index.html', './client/build/200.html')
  File.write('./client/build/index.html', driver.page_source)

  # system("kill #{pid}")
ensure
  driver.quit
end
