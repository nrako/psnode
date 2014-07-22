var ChildProcess = require('child_process');
var csv = require('csv');

/**
 * List processes
 */
module.exports.list = function (callback) {
  if (process.platform !== 'darwin'){
		// must be windows
		ChildProcess.exec('tasklist /FO csv /NH', function (err, stdout, stderr) {
			if (err || stderr)
				return callback(err || stderr.toString());

			csv.parse(stdout, function (err, data) {
				if (err)
					return callback(err);

				var results = data.map(function (row) {
					return {
						pid: parseInt(row[1], 10),
						command: row[0]
					};
				});

				callback(null, results);
			});
		});
		return;
  }

	// it's OSX yay!
  ChildProcess.exec('ps -Ao pid,command', function (err, stdout, stderr) {
    if (err || stderr)
      return callback(err || stderr.toString());

		var results = [];
		stdout.split('\n').map(function (row) {
			var matches = row.match(/(\d+) (.*)/);
			if (!matches)
				return;

			results.push({
				pid: parseInt(matches[1], 10),
				command: matches[2]
			});
		});

    callback(null, results);
  });
};


/**
 * Kill process
 */

module.exports.kill = function (pid, next) {
  var killCommand = process.platform !== 'darwin' ? 'taskkill /F /PID ' + pid : 'kill ' + pid;
  ChildProcess.exec(killCommand, function (err, stdout, stderr) {
    if (err || stderr)
      return next( err || stderr.toString() );

    stdout = stdout.toString();

    // wait a while (200ms) for windows before calling callback
    if (process.platform !== 'darwin') {
      setTimeout(function () {
        next(null, stdout);
      }, 200 );
			return;
    }

    next(null, stdout);
  });
};
