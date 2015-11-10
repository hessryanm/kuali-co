'use strict';

/**
* @const
* @name TRIPS_TILL_MAINTENANCE
* @description the maximum number of trips until an elevator needs to enter maintenance mode
*/
var TRIPS_TILL_MAINTENANCE = 100;

/**
* @class
* @name Elevator
* @description represents a single elevator
*/
function Elevator () {}

/**
* @function
* @public
* @name Elevator.create
* @description creates and returns a new elevator, with properties initialized to default values
* @returns {Function} - a new instance of the Elevator class
*/
Elevator.create = function () {
  var elev = new Elevator()
    ;

  elev.numTrips = 0;
  elev.currentFloor = 1;
  elev.occupied = false;
  elev.needsMaintenance = false;
  elev.destFloor = null;
  elev.moving = false;

  return elev;
};

var p = Elevator.prototype
  ;

/**
* @function
* @public
* @name Elevator.prototype.addTrip
* @description adds one to the number of trips this elevator has taken.  If that number is then >= TRIPS_TILL_MAINTENANCE, also sets the elevator's needsMaintenance property to true.
*/
p.addTrip = function () {
  var me = this
    ;

  me.numTrips++;
  if (me.numTrips >= TRIPS_TILL_MAINTENANCE) {
    me.needsMaintenance = true;
  }
};

module.exports = Elevator;