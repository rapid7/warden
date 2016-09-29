#
# Cookbook Name:: warden
# Recipe:: default
#
# Copyright (C) 2016 Rapid7 LLC.
#
# Distributed under terms of the MIT License. All rights not explicitly granted
# in the MIT license are reserved. See the included LICENSE file for more details.
#

#######################
## Install NodeJS 4.x
#
# This should be moved into a shared cookbook
##
include_recipe 'apt::default'

apt_repository 'nodejs-4x' do
  uri 'https://deb.nodesource.com/node_4.x'
  distribution node['lsb']['codename']
  components ['main']
  key 'https://deb.nodesource.com/gpgkey/nodesource.gpg.key'
end

package 'nodejs'
#######################

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

directory node['warden']['paths']['directory'] do
  owner node['warden']['user']
  group node['warden']['group']
  mode '0755'

  recursive true
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
  notifies :run, "execute[chown Warden]"
end

## Chown the contents of the Warden directory to the Warden user/group
execute "chown Warden" do
  command "chown -R #{node['warden']['user']}:#{node['warden']['group']} #{node['warden']['paths']['directory']}"
  user 'root'
  action :nothing
end

## Upstart Service
template '/etc/init/warden.conf' do
  owner node['warden']['user']
  group node['warden']['group']

  source 'upstart.conf.erb'
  variables(
    :description => 'warden configuration service',
    :user => node['warden']['user'],
    :executable => node['warden']['paths']['executable'],
    :flags => [
      "-c #{node['warden']['paths']['configuration']}"
    ]
  )
end

directory 'warden-configuration-directory' do
  path ::File.dirname(node['warden']['paths']['configuration'])

  owner node['warden']['user']
  group node['warden']['group']
  mode '0755'

  recursive true
end

template 'warden-configuration' do
  path node['warden']['paths']['configuration']
  source 'json.erb'

  owner node['warden']['user']
  group node['warden']['group']

  variables(:properties => node['warden']['config'])
end

service 'warden' do
  ## The wrapping cookbook must call `action` on this resource to start/enable
  action :nothing

  provider Chef::Provider::Service::Upstart
end
