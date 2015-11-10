'use strict';

var _ = require("lodash")
  , EventEmitter = require('events').EventEmitter
  , util = require("util")
  ;

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
util.inherits(Elevator, EventEmitter);

/**
* @function
* @public
* @name Elevator.create
* @description creates and returns a new elevator, with properties initialized to default values
* @param {Number} [min] - the lowest floor the elevator can go to.  Defaults to 1
* @param {Number} [max] - the highest floor the elevator can go to.  Defaults to 1
* @returns {Function} - a new instance of the Elevator class
*/
Elevator.create = function (min, max) {
  var elev = new Elevator()
    ;

  if (_.isUndefined(min) || !_.isNumber(min)) {
    min = 1;
  }

  if (_.isUndefined(max) || !_.isNumber(max)) {
    max = 1;
  }

  if (max < min) {
    throw new Error("Elevator cannot be created with a max floor < min floor");
  }

  /**
  * @property
  * @static
  * @name MAX_FLOOR
  * @description the highest floor the elevator can move to
  * @type Number
  * @default 1
  */
  elev.MAX_FLOOR = max;

  /**
  * @property
  * @static
  * @name MIN_FLOOR
  * @description the lowest floor the elevator can move to
  * @type Number
  * @default 1
  */
  elev.MIN_FLOOR = min;

  /**
  * @property
  * @name Elevator.numTrips
  * @description the number of trips this elevator has made since its last maintenance
  * @type Number
  * @default 0
  */
  elev.numTrips = 0;
  /**
  * @property
  * @name Elevator.currentFloor
  * @description the floor at which the elevator is currently
  * @type Number
  * @default 1
  */
  elev.currentFloor = 1;
  /**
  * @property
  * @name Elevator.occupied
  * @description whether there is anyone in the elevator
  * @type Boolean
  * @default false
  */
  elev.occupied = false;
  /**
  * @property
  * @name Elevator.needsMaintenance
  * @description whether the elevator is in "maintenance mode"
  * @type Boolean
  * @default false
  */
  elev.needsMaintenance = false;
  /**
  * @property
  * @name Elevator.destinations
  * @description the list of destinations the elevator should be going to, in order
  * @type Array
  * @default []
  */
  elev.destinations = [];
  /**
  * @property
  * @name Elevator.moving
  * @description whether the elevator is currently moving
  * @type Boolean
  * @default false
  */
  elev.moving = false;
  /**
  * @property
  * @name Elevator.direction
  * @description which direction the elevator is moving (up or down).  1 is up, -1 is down
  * @type Enum (1, -1)
  * @default 1
  */
  elev.direction = 1;

  return elev;
};

var p = Elevator.prototype
  ;

/**
* @function
* @private
* @name Elevator.prototype._addDestination
* @description adds a destination to the elevator's destination list, and ensures it remains in sorted order
* @param {Number} floor - the floor number to add to the destinations list
* @returns {Boolean} whether it actually added the dest to the array
*/
p._addDestination = function (floor) {
  var me = this
    ;

  if (!_.isNumber(floor)) {
    throw new Error("Elevator.prototype._addDestination called with a non-number: "+floor);
  }

  if (me.currentFloor === floor) {
    //emit "at dest"
    return false;
  }

  if (floor > me.MAX_FLOOR || floor < me.MIN_FLOOR) {
    //emit "can't go there"
    return false;
  }

  me.destinations.push(floor);
  if (!me.moving) {
    if (floor < me.currentFloor) {
      me.direction = -1;
    } else {
      me.direction = 1;
    }
  }
  me.moving = true;

  me.destinations.sort(me._getDestinationsSortFunction());

  return true;
};

/**
* @function
* @private
* @name Elevator.prototype._getDestinationsSortFunction
* @description returns a sort function for the destinations, depending on elevator.direction
* @returns {Function} - sort function comparator
*/
p._getDestinationsSortFunction = function () {
  var me = this
    ;

  if (me.direction === 1) {
    return function (a, b) {
      return a - b;
    };
  } else {
    return function (a, b) {
      return b - a;
    };
  }
};

/**
* @function
* @public
* @name Elevator.prototype.addTrip
* @description adds one to the number of trips this elevator has taken.  If that number is then >= TRIPS_TILL_MAINTENANCE, also sets the elevator's needsMaintenance property to true.
* @returns undefined
*/
p.addTrip = function () {
  var me = this
    ;

  me.numTrips++;
  if (me.numTrips >= TRIPS_TILL_MAINTENANCE) {
    me.needsMaintenance = true;
  }
};

/**
* @function
* @public
* @name Elevator.prototype.goToFloor
* @description tells the elevator to go to the given floor.  Adds the given floor as a destination and calls addTrip()
* @param {Number} floor - the floor to go to
* @returns {Boolean} - whether it's actually going to make a trip to that floor
*/
p.goToFloor = function (floor) {
  var me = this
    ;

  if (!_.isNumber(floor)) {
    throw new Error("Elevator.prototype.goToFloor called with a non-number: "+floor);
  }

  if (me._addDestination(floor)) {
    me.addTrip();
    return true;
  }

  return false;
};

/**
* @function
* @public
* @name Elevator.prototype.insideButtonPressed
* @description this function is what the controller should call when the inside buttons were pressed (someone said what floor they want to go to)
* @param {Number} floor - the floor to go to
* @returns undefined
*/
p.insideButtonPressed = function (floor) {
  var me = this
    ;

  if (!_.isNumber(floor)) {
    throw new Error("Elevator.prototype.goToFloor called with a non-number: "+floor);
  }

  if (me.goToFloor(floor)) {
    me.occupied = true;
  }
};

module.exports = Elevator;