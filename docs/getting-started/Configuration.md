# How to Configure Warden #

Configuration options for warden can be specified by providing a configuration
file on the command-line.

## Command-line Options ##

The options below are specified on the command-line.

* `--config` - A configuration file to load. For more information on the format
  of this file, see the **Configuration Files** section. Only one configuration
  file can be specified. Multiple uses of this argument will result in only the
  last configuration file being read.

## Configuration Files ##

Configuration files are JSON formatted. They are a single JSON object
containing configuration values.

### Default Configuration File ###

The configuration file, located in warden/config/defaults.json below is the default settings for warden.

~~~json
{
  "vault": {
    "port": 8200,
    "hostname": "localhost",
    "token": "Place-Vault-Token-Here"
  },
  "service": {
    "port": 8080,
    "hostname": "localhost"
  },
  "log": {
    "level": "info"
  }
}
~~~

### Configuration Key Reference ###

* `Vault` - These settings contain how warden will reach the vault server.

  The following keys are available:

  * `port` - The port vault listens on. Defaults to 8200.

  * `hostname` - The address the HTTP request to vault uses. Defaults to "localhost".

  * `token` The token from vault that warden uses to create orphaned tokens for requesting servers.

* `log` - These settings control logging.

  Warden treats logging as an event stream and logs to `stdout`. Logged events
  are formatted as JSON objects separated by newlines. If you need routing or
  storage of logs, you'll want to handle that outside warden.

  The following keys are available:

  * `level` - The level to log at. Valid values are "debug", "verbose", "info",
    "warn", and "error". Each log level encompasses all the ones below it. So
    "debug" is the most verbose and "error" is the least verbose. Defaults to
    "info".

* `service` - These settings configure how warden is set up.

  The following keys are available:

  * `port` - The port warden listens on. Defaults to 8080.

  * `hostname` - The address the HTTP request to warden uses. Defaults to "localhost".
