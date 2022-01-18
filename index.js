const { exec } = require("child_process");
module.exports = function( app, db ){

	// $ lsof -i :3001
	// $ kill -15 PROCESS_ID 
	// $ kill -9 PROCESS_ID 
	// npx kill-port 3000

	app.get('/kill-port/:port', function( req, res ){
		// import exec method from child_process module
		const port = req.params.port >> 0;
		exec("npx kill-port " + port);
		return res.send('kill-port ' + port);
	});

	app.get('/kill-port-and-restart/:port', function( req, res ){
		// import exec method from child_process module
		const port = req.params.port >> 0;
		exec("npx kill-port " + port + " && node index.js ");
		return res.send('kill-port ' + port);
	});

	app.get('/kill-process/:pid', function( req, res ){
		// import exec method from child_process module
		const pid = req.params.pid >> 0;
		exec("kill -9 " + pid); // -15
		return res.send('process killed');
	});

	app.get('/kill-process-and-restart/:pid', function( req, res ){
		// import exec method from child_process module
		const pid = req.params.pid >> 0;
		exec("kill -9 " + pid + " && node index.js"); // -15
		return res.send('process killed');
	});

	app.get('/list-of-process', function( req, res ) {
		let out = '';
		exec("ps -aef | grep 'node'", (e, stdout, stderr)=> {
			if (e instanceof Error) {
					console.error(e);
					//throw e;
			}
			console.log("stdout:\n",stdout);
			console.log("stderr:\n",stderr);

			out += stdout;
			out += stderr;

			exec("lsof -i", (e, stdout, stderr)=> {
				if (e instanceof Error) {
						console.error(e);
						//throw e;
					}
				console.log("stdout:\n",stdout);
				console.log("stderr:\n",stderr);
	
				out += stdout;
				out += stderr;

				res.send('<html><pre>' + out);

			});	
		});	
	});
	
	app.get('/list-all-processes', function( req, res ) {
		let out = '';
		exec("ps -aef", (e, stdout, stderr)=> {
			if (e instanceof Error) {
					console.error(e);
					//throw e;
			}
			console.log("stdout:\n",stdout);
			console.log("stderr:\n",stderr);

			out += stdout;
			out += stderr;

			exec("lsof -i", (e, stdout, stderr)=> {
				if (e instanceof Error) {
						console.error(e);
						//throw e;
					}
				console.log("stdout:\n",stdout);
				console.log("stderr:\n",stderr);
	
				out += stdout;
				out += stderr;

				res.send('<html><pre>' + out);

			});	
		});	
	});

	app.get('/npm/:type/:pid/:list', function( req, res ) {

		const list = String(req.params.list).replace(/\|/g,'/').split(',').join(' ');
		const pid1 = req.params.pid >> 0;
		const pid2 = process.pid >> 0;
	   	let type = req.params.type === 'u' ? 'uninstall' : (req.params.type === 'i' ? 'i' : false);

		if( !type || !pid1 || !pid2 || pid1 !== pid2 || list.length < 4 ) {
			//res.send((pid1 === pid2 ? 'TRUE' : 'FALSE') + '|' + pid1 + '|' + pid2);
			res.send('Error');
			return;	
		}

		let out = '';
		const scrpt = `npm ${type} ${list}`;
		exec(scrpt, (e, stdout, stderr)=> {
			if (e instanceof Error) {
					console.error(e);
					//throw e;
			}
			console.log("stdout:\n",stdout);
			console.log("stderr:\n",stderr);

			out += stdout;
			out += stderr;

			res.send('<html><pre>' + out);

		});	
	});

	app.get('/npm/fix/:pid', function( req, res ) {

		const pid1 = req.params.pid >> 0;
		const pid2 = process.pid >> 0;

		if(!pid1 || !pid2 || pid1 !== pid2) {
			//res.send((pid1 === pid2 ? 'TRUE' : 'FALSE') + '|' + pid1 + '|' + pid2);
			res.send('Error');
			return;	
		}

		let out = '';
		const scrpt = `npm audit fix`;
		exec(scrpt, (e, stdout, stderr)=> {
			if (e instanceof Error) {
					console.error(e);
					//throw e;
			}
			console.log("stdout:\n",stdout);
			console.log("stderr:\n",stderr);

			out += stdout;
			out += stderr;

			res.send('<html><pre>' + out);

		});	
	});

}