// Startup bootstrap.

console.info("main: booting up");

global.Vendors = { types: [], labels: [], list: [] };
require("./lib/cron")();
require("./lib/serv")();