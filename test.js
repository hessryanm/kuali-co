'use strict';

/* jshint expr:true */

var Elevator = require("./elevator")
  , chai = require("chai")
  , expect = chai.expect
  ;

chai.should();

describe("Test elevator class", function () {
  var elevator
    ;

  beforeEach(function () {
    elevator = Elevator.create();
  });

  it ("should initialize an elevator, and all properties should exist", function () {
    expect(elevator).to.exist;
    elevator.should.have.ownProperty('numTrips');
    elevator.should.have.ownProperty('currentFloor');
    elevator.should.have.ownProperty('occupied');
    elevator.should.have.ownProperty('needsMaintenance');
  });

  it ("should have expected default values for new elevator", function () {
    elevator.numTrips.should.be.a('number').and.equal(0);
    elevator.currentFloor.should.be.a('number').and.equal(1);
    elevator.occupied.should.be.a('boolean').and.be.false;
    elevator.needsMaintenance.should.be.a('boolean').and.be.false;
  });
});