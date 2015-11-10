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

  describe("create function", function () {
    it ("should initialize an elevator, and all properties should exist", function () {
      expect(elevator).to.exist;
      elevator.should.have.ownProperty('numTrips');
      elevator.should.have.ownProperty('currentFloor');
      elevator.should.have.ownProperty('occupied');
      elevator.should.have.ownProperty('needsMaintenance');
      elevator.should.have.ownProperty('destFloor');
      elevator.should.have.ownProperty('moving');
    });

    it ("should have expected default values for new elevator", function () {
      elevator.numTrips.should.be.a('number').and.equal(0);
      elevator.currentFloor.should.be.a('number').and.equal(1);
      elevator.occupied.should.be.a('boolean').and.be.false;
      elevator.needsMaintenance.should.be.a('boolean').and.be.false;
      elevator.moving.should.be.a('boolean').and.be.false;
      expect(elevator.destFloor).to.be.null;
    });
  });

  describe("prototype addTrip function", function () {
    it ("should add one to the elevator's 'numTrips' property when addTrip is called", function () {
      elevator.numTrips.should.equal(0);
      elevator.addTrip();
      elevator.numTrips.should.equal(1);
      elevator.addTrip();
      elevator.numTrips.should.equal(2);
    });

    it ("should set the elevator's 'needsMaintenance' property to true if numTrips = max trips when addTrip is called", function () {
      elevator.numTrips = 98;
      elevator.addTrip();
      elevator.numTrips.should.equal(99);
      elevator.needsMaintenance.should.be.false;
      elevator.addTrip();
      elevator.numTrips.should.equal(100);
      elevator.needsMaintenance.should.be.true;
    });

    it ("should set 'needsMaintenance' even if new numTrips is > max trips in addTrip", function () {
      elevator.needsMaintenance.should.be.false;
      elevator.numTrips = 500;
      elevator.needsMaintenance.should.be.false;
      elevator.addTrip();
      elevator.numTrips.should.equal(501);
      elevator.needsMaintenance.should.be.true;
    });
  });
});