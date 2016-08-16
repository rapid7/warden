default['warden']['user'] = 'warden'
default['warden']['group'] = 'warden'

default['warden']['paths']['directory'] = '/opt/warden'
default['warden']['paths']['executable'] = ::File.join(node['warden']['paths']['directory'], 'bin/server.js')

default['warden']['config'] = Mash.new
default['warden']['version'] = nil
