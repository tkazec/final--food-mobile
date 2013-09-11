console.info("main: booting up");

global.Vendors = [];
require("./lib/cron")();
require("./lib/serv")();