const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");

let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Vehicle.deleteMany();
  await Booking.deleteMany();
});

describe("Booking API", () => {
  it("should create a booking successfully", async () => {
    const vehicle = await Vehicle.create({ name: "Truck D", capacityKg: 2000, tyres: 10 });

    const res = await request(app)
      .post("/api/bookings")
      .send({
        vehicleId: vehicle._id,
        fromPincode: "100000",
        toPincode: "100010",
        startTime: "2023-10-27T10:00:00Z",
        customerId: "cust123",
      });

    expect(res.status).toBe(201);
    expect(res.body.vehicleId).toBe(vehicle._id.toString());
  });

  it("should prevent double booking on same vehicle/time", async () => {
    const vehicle = await Vehicle.create({ name: "Truck E", capacityKg: 2000, tyres: 10 });

    // First booking
    await request(app).post("/api/bookings").send({
      vehicleId: vehicle._id,
      fromPincode: "200000",
      toPincode: "200010",
      startTime: "2023-10-27T10:00:00Z",
      customerId: "cust111",
    });

    // Second booking (conflict expected)
    const res = await request(app).post("/api/bookings").send({
      vehicleId: vehicle._id,
      fromPincode: "200005",
      toPincode: "200015",
      startTime: "2023-10-27T10:30:00Z",
      customerId: "cust222",
    });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Vehicle already booked");
  });
});
