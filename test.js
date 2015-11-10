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
      elevator.should.have.ownProperty('destinations');
      elevator.should.have.ownProperty('moving');
      elevator.should.have.ownProperty('direction');
      elevator.should.have.ownProperty('MAX_FLOOR');
      elevator.should.have.ownProperty('MIN_FLOOR');
    });

    it ("should have expected default values for new elevator", function () {
      elevator.numTrips.should.be.a('number').and.equal(0);
      elevator.currentFloor.should.be.a('number').and.equal(1);
      elevator.occupied.should.be.a('boolean').and.be.false;
      elevator.needsMaintenance.should.be.a('boolean').and.be.false;
      elevator.moving.should.be.a('boolean').and.be.false;
      elevator.destinations.should.be.an("array").and.have.length(0);
      elevator.direction.should.be.a('number').and.equal(1);
      elevator.MAX_FLOOR.should.be.a('number').and.equal(1);
      elevator.MIN_FLOOR.should.be.a('number').and.equal(1);
    });

    describe("with min and max", function () {
      it ("should set elevator properties by min and max create params", function () {
        elevator = Elevator.create(5, 10);
        elevator.MIN_FLOOR.should.equal(5);
        elevator.MAX_FLOOR.should.equal(10);
      });

      it ("should throw if max < min", function () {
        expect(function () {
          Elevator.create(5, 4);
        }).to.throw;
      });
    });
  });

  describe("addTrip function", function () {
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

  describe("adding a destination", function () {
    beforeEach(function () {
      elevator = Elevator.create(1, 100);
    });

    describe("sorting the destinations array", function () {
      it ("should sort in ascending order if Elevator.direction = 1", function () {
        elevator.direction.should.equal(1);
        elevator.destinations = [
          5
        , 18
        , 1
        , 7
        ];
        elevator.destinations.sort(elevator._getDestinationsSortFunction());
        elevator.destinations.should.deep.equal([
          1
        , 5
        , 7
        , 18
        ]);
      });
      it ("should sort in descending order if Elevator.direction = -1", function () {
        elevator.direction = -1;
        elevator.destinations = [
          5
        , 18
        , 1
        , 7
        ];
        elevator.destinations.sort(elevator._getDestinationsSortFunction());
        elevator.destinations.should.deep.equal([
          18
        , 7
        , 5
        , 1
        ]);
      });
    });

    it ("should add the number is the appropriate sorted location", function () {
      elevator.destinations = [
        3
      , 5
      ];
      elevator._addDestination(4);
      elevator.destinations.should.deep.equal([
        3
      , 4
      , 5
      ]);
      elevator._addDestination(99);
      elevator.destinations.should.deep.equal([
        3
      , 4
      , 5
      , 99
      ]);
      elevator._addDestination(2);
      elevator.destinations.should.deep.equal([
        2
      , 3
      , 4
      , 5
      , 99
      ]);
    });

    it ("should set moving = true when a destination is added", function () {
      elevator.moving.should.be.false;
      elevator._addDestination(2);
      elevator.moving.should.be.true;
    });

    it ("should set elevator direction appropriately if it's not moving before getting new dest", function () {
      elevator.direction.should.equal(1);
      elevator.currentFloor = 5;
      elevator._addDestination(3);
      elevator.direction.should.equal(-1);

      elevator.moving = false;
      elevator._addDestination(6);
      elevator.direction.should.equal(1);
    });

    it ("shouldn't set the direction or moving, or push to the array, if the given floor is the current floor", function () {
      elevator.currentFloor.should.equal(1);
      elevator.moving.should.be.false;
      elevator.direction.should.equal(1);

      elevator.currentFloor = 3;
      elevator._addDestination(3);
      elevator.destinations.should.have.length(0);
      elevator.moving.should.be.false;
      elevator.direction.should.equal(1);
    });

    it ("shouldn't add destination if it's > max or < min", function () {
      elevator = Elevator.create(2, 3);
      elevator._addDestination(2);
      elevator.destinations.should.have.length(1);
      elevator._addDestination(1);
      elevator.destinations.should.have.length(1);
      elevator._addDestination(4);
      elevator.destinations.should.have.length(1);
    });

    it ("should return true if the num was added to the array", function () {
      elevator = Elevator.create(2, 3);
      elevator._addDestination(2).should.be.true;
    });

    it ("should return false if the num is > max or < min", function () {
      elevator = Elevator.create(1, 1);
      elevator._addDestination(2).should.be.false;
      elevator._addDestination(0).should.be.false;
    });

    it ("should return false if the given num is === current floor", function () {
      elevator._addDestination(1).should.be.false;
    });
  });

  describe("goToFloor", function () {
    beforeEach(function () {
      elevator = Elevator.create(1, 3);
    });

    it ("should add the floor number to the destinations array", function () {
      elevator.goToFloor(3);
      elevator.destinations.should.have.length(1).and.contain(3);
    });

    it ("should set moving = true", function () {
      elevator.goToFloor(3);
      elevator.moving.should.be.true;
    });

    it ("should add one to the trip count", function () {
      elevator.numTrips.should.equal(0);
      elevator.goToFloor(3);
      elevator.numTrips.should.equal(1);
    });

    it ("shouldn't add one to the trip count if _addDestination failed", function () {
      elevator.numTrips.should.equal(0);
      elevator.goToFloor(4);
      elevator.numTrips.should.equal(0);
    });

    it ("should return what _addDestination returned", function () {
      elevator.goToFloor(3).should.be.true;
      elevator.goToFloor(4).should.be.false;
    });
  });

  describe("insideButtonPressed", function () {
    beforeEach(function () {
      elevator = Elevator.create(1, 3);
    });

    it ("should add the floor given to the destinations array", function () {
      elevator.insideButtonPressed(2);
      elevator.destinations.should.have.length(1);
    });

    it ("should set occupied to true if goToFloor returned true", function () {
      elevator.insideButtonPressed(2);
      elevator.occupied.should.be.true;
    });

    it ("should not set occupied if goToFloor failed", function () {
      elevator.insideButtonPressed(1);
      elevator.occupied.should.be.false;
      elevator.destinations.should.have.length(0);
    });
  });
});