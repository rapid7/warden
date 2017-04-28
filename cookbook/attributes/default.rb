#
# Cookbook Name:: warden
# Attribute:: default
#
# Copyright (C) 2017 Rapid7 LLC.
#
# Distributed under terms of the MIT License. All rights not explicitly granted
# in the MIT license are reserved. See the included LICENSE file for more details.
#

default['warden']['user'] = 'warden'
default['warden']['group'] = 'warden'

default['warden']['paths']['directory'] = '/opt/warden'
default['warden']['paths']['executable'] = ::File.join(node['warden']['paths']['directory'], 'bin/server.js')
default['warden']['paths']['configuration'] = '/etc/warden/config.json'

default['warden']['config'] = Mash.new
default['warden']['version'] = nil
default['warden']['enable'] = true
