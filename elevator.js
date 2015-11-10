'use strict';

function Elevator () {}

Elevator.create = function () {
  var elev = new Elevator()
    ;

  elev.numTrips = 0;
  elev.currentFloor = 1;
  elev.occupied = false;
  elev.needsMaintenance = false;

  return elev;
};


module.exports = Elevator;