'use strict';

/* jshint expr:true */

var Elevator = require("./elevator")
  , chai = require("chai")
  , expect = chai.expect
  ;

chai.should();

describe("Test elevator class", function () {
  it ("should initialize an elevator, and all properties should exist", function () {
    var elevator = Elevator.create()
      ;

    expect(elevator).to.exist;
    elevator.should.have.ownProperty('numTrips');
    elevator.should.have.ownProperty('currentFloor');
    elevator.should.have.ownProperty('occupied');
    elevator.should.have.ownProperty('needsMaintenance');
  });
});