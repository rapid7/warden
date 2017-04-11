build_name 'warden'

autoversion.create_tags false
autoversion.search_tags false

cookbook.depends 'warden' do |warden|
  warden.path './cookbook'
end

profile :default do |default|
  default.chef.run_list ['warden::nodejs', 'warden::default']
end
