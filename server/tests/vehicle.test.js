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

describe("Vehicle API", () => {
  it("should add a new vehicle", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .send({ name: "Truck A", capacityKg: 1000, tyres: 6 });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Truck A");
  });

  it("should fail to add vehicle with missing fields", async () => {
    const res = await request(app).post("/api/vehicles").send({ name: "Truck B" });
    expect(res.status).toBe(400);
  });

  it("should return available vehicles", async () => {
    const vehicle = await Vehicle.create({ name: "Truck C", capacityKg: 1500, tyres: 8 });

    const res = await request(app).get(
      `/api/vehicles/available?capacityRequired=500&fromPincode=123456&toPincode=123460&startTime=2023-10-27T10:00:00Z`
    );

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Truck C");
  });
});
