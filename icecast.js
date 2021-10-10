

import DigestFetch from "digest-fetch"
import {parseString } from 'xml2js';
import cache from 'persistent-cache';

const ICECAST_STATUS_URL = "http://localhost:8000/admin/stats.xml";
const ICECAST_ADMIN_USER = 'admin';
const ICECAST_ADMIN_PASSWORD = 'secret';

const TTL = 15000; // 1min

const args = process.argv.slice(2)

const data = cache({ duration: TTL, base: '/tmp' });

try {
	let status = data.getSync('status');
	if (!status) {
		// there is no valid cache, get it from server:
		status = await getStatus();
		data.putSync('status', status);
	}

	if (args.length == 1) {

		console.log(status.icestats[ args[0] ][0])
		process.exit(2)

	}

	if (args.length > 1) { 

		const source = status.icestats.source.filter((s) => {
			return s.$.mount === args[0]
		})

		if (source.length<1) process.exit(2)

		console.log(source[0][ args[1] ][0])


		process.exit(2)
	}

	const sources = status.icestats.source.map((s) => {
		return { "{#NAME}": s.$.mount,  "{#STATUS}": 1 }
	});

	console.log(JSON.stringify({data:sources}))

} catch(e) {
	// do nothing
}


function getStatus() {

  const client = new DigestFetch(ICECAST_ADMIN_USER, ICECAST_ADMIN_PASSWORD, { basic: true })
  return client.fetch(ICECAST_STATUS_URL)
    .then(res => res.text())
    .then(body=> new Promise(resolve => {
    	parseString(body, (e,x)=>{
    	 resolve(x)
    	})
	}))
}
