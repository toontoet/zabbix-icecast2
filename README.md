# zabbix-icecast2
Script to monitor icecast2 mounts using Zabbix


## Installation

Make sure you have a working nodejs + yarn enviorment on your icecast2 server.

Then clone this repo:

```sh
cd /etc/zabbix
git clone https://github.com/toontoet/zabbix-icecast2.git
```

CD into folder and install deps:
```sh
cd zabbix-icecast2
yarn
```

Edit the file `/etc/zabbix/zabbix-icecast2/icecast.js` and change the location, username and password of your icecast instance.
```js
const ICECAST_STATUS_URL = "http://localhost:8000/admin/stats.xml";
const ICECAST_ADMIN_USER = 'admin';
const ICECAST_ADMIN_PASSWORD = 'something';
```

check where your local `node` binary is installed:
```sh
which node
```

Add the following lines to your `zabbix_agentd.conf`. Make sure the path to `node` matches the localy isntalled node binary.

```
UserParameter=icecast2.discovery,/usr/bin/node /etc/zabbix/zabbix-icecast2/icecast.js
UserParameter=icecast2.status[*],/usr/bin/node /etc/zabbix/zabbix-icecast2/icecast.js $1 $2
```

Finaly, restart your `zabbix-agent`

## Zabbix Icecast2 Tempalte

Import the file `template/zabbix_icecast2_template.xml` into your zabbix server configuration and assign it to your monitored host.


## Custom item & values

You can change the monitored items from the Zabbix admin. You can use every property of the source object that is returned by the status xml of your icecast server.

Change to second argument of the item-key into one of the available properties:

Example item key:
```
icecast2.status[{#NAME},total_bytes_sent]
```
Available properties:

```
{
  '$': { mount: '/stream' },
  audio_info: [ 'ice-bitrate=192;ice-channels=2;ice-samplerate=48000' ],
  authenticator: [ 'url' ],
  genre: [ 'Generic' ],
  'ice-bitrate': [ '192' ],
  'ice-channels': [ '2' ],
  'ice-samplerate': [ '48000' ],
  listener_peak: [ '0' ],
  listeners: [ '0' ],
  listenurl: [ 'http://server:8000/stream' ],
  max_listeners: [ 'unlimited' ],
  public: [ '0' ],
  server_description: [ 'Popular Music' ],
  server_name: [ 'Radio Zabbix' ],
  server_type: [ 'audio/mpeg' ],
  server_url: [ 'www.zabbix.com' ],
  slow_listeners: [ '0' ],
  source_ip: [ 127.0.0.1' ],
  stream_start: [ 'Fri, 28 May 2020 20:06:33 +0200' ],
  stream_start_iso8601: [ '2020-05-28T20:06:33+0200' ],
  title: [ "Monitor me" ],
  total_bytes_read: [ '5994115400' ],
  total_bytes_sent: [ '0' ],
  user_agent: [ 'butt 0.1.18' ]
}

```