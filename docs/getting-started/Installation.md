# How to install Warden #

[Releases of Warden][releases] include both source tarballs and Debian
packages. Debian and Ubuntu based Linux distributions can use the pre-built
packages. Other operating systems should install Warden from source.

## Installing from the Debian package ##

Warden runs on the 4.4.x LTS version of Node.js, so follow the [instructions
for installing Node.js on Debian based systems][node-debian].

Download a pre-built Debian package of Warden from [the releases
page][releases] and save it. These instructions assume you've saved the package
to `/tmp/warden.deb`.

Use `dpkg` to install Warden.

~~~bash
dpkg -i /tmp/warden.deb
~~~

Warden is installed into `/opt/warden`.

## Installing from source ##

Warden runs on the 4.4.x LTS version of Node.js, so follow the [instructions
for installing Node.js][node-source].

Download a tarball of the Warden sources from [the releases page][releases] and
save it. These instructions assume you've saved the tarball to
`/tmp/warden.tar.gz`.

Create a new folder for Warden. These instructions assume you're using
`/opt` as that folder.

~~~bash
mkdir /opt
~~~

Use `npm` to install Warden.

~~~bash
cd /opt
npm install /tmp/warden.tar.gz
~~~

Warden is installed into `/opt/node_modules/warden`.

[releases]: https://github.com/rapid7/warden/releases/latest
[node-debian]: https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
[node-source]: https://nodejs.org/en/download/
