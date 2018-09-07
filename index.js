var Drone = require('./lib/drone').default;
var Overlord = require('hive-overlord.js').default;
const OVERLORD_MAX_POPULATION = require('hive-overlord.js').MAX_POPULATION;
var Cralwer = require('hive-crawler.js').default;


function setup(overlord) {
    var o = overlord || new Overlord();

    // recruit drone
    var d = new Drone();
    o.connectDrone(d);

    // recruit crawlers;
    for (var i = 0; i < OVERLORD_MAX_POPULATION; i++) {
        var c = new Cralwer();
        o.connectCrawler(c);
    }

    return d;
}

exports = module.exports = {
    default: Drone,
    setup: setup
}
