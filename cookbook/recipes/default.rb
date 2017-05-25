#
# Cookbook Name:: warden
# Recipe:: default
#
# Copyright (C) 2017 Rapid7 LLC.
#
# Distributed under terms of the MIT License. All rights not explicitly granted
# in the MIT license are reserved. See the included LICENSE file for more details.
#

node.default['warden']['version'] = cookbook_version

group node['warden']['group'] do
  system true
end

user node['warden']['user'] do
  comment 'warden operator'
  system true

  gid node['warden']['group']
  home node['warden']['paths']['directory']
end

## Fetch and install warden
remote_file 'warden' do
  source Warden::Helpers.github_download('rapid7', 'warden', node['warden']['version'])
  path ::File.join(Chef::Config['file_cache_path'], "warden-#{node['warden']['version']}.deb")

  action :create_if_missing
  backup false
end

package 'warden' do
  source resources('remote_file[warden]').path
  provider Chef::Provider::Package::Dpkg
  version node['warden']['version']
end

## Upstart Service
template '/etc/init/warden.conf' do
  source 'upstart.conf.erb'
  variables(
    :description => 'warden configuration service',
    :user => node['warden']['user'],
    :executable => node['warden']['paths']['executable'],
    :flags => [
      "-c #{node['warden']['paths']['configuration']}"
    ]
  )

  notifies :restart, 'service[warden]' if node['warden']['enable']
end

directory 'warden-configuration-directory' do
  path ::File.dirname(node['warden']['paths']['configuration'])
  mode '0755'

  recursive true
end

template 'warden-configuration' do
  path node['warden']['paths']['configuration']
  source 'json.erb'

  variables(:properties => node['warden']['config'])

  notifies :restart, 'service[warden]' if node['warden']['enable']
end

service 'warden' do
  action node['warden']['enable'] ? [:start, :enable] : [:stop, :disable]
  provider Chef::Provider::Service::Upstart
end
