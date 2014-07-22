psnode
======

A Node.js KISS module to list and kill process on OSX and Windows.

This use `ps` and `tasklist` to list processes and `kill` and `taskkill` to kill a process.

## Install

```bash
$ npm install psnode
```

## Usage

### List processes

```javascript
var ps = require('psnode');

ps.list(function(err, results) {
  if (err)
    throw new Error( err );

  console.log(results); // [{pid: 2352, command: 'command'}, {...}]
});
```

### Kill process by PID

```javascript
var ps = require('psnode');

ps.kill(12345, function(err, stdout) {
  if (err)
    throw new Error(err);

  console.log(stdout); // stdout for kill or taskkill command if any
});
```

## Note

If the full command line is required on windows [wmic.exe](http://ss64.com/nt/wmic.html) would be the way to go but it's not available on Windows XP Home Edition.

## Licence

(MIT)
