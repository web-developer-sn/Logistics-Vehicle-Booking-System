const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");

const addVehicle = async (req, res, next) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || !capacityKg || !tyres) {
      return res.status(400).json({ message: "All fields required",action:"error" });
    }
    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    res.status(201).json({...vehicle.toObject(),message:"Vehicle added successfully",action:"success"});
  } catch (err) {
    next(err);
  }
};

const getAvailableVehicles = async (req, res, next) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    if (!capacityRequired) {
      return res.status(400).json({
        message: "Capacity is required",
        action: "error",
      });
    }

    const vehicles = await Vehicle.find({ capacityKg: { $gte: capacityRequired } });


    if (!fromPincode || !toPincode || !startTime) {
      res.setHeader("Cache-Control", "no-store");
      return res.json(vehicles);
    }

    const estimatedRideDurationHours =
      Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;

    const start = new Date(startTime);
    const end = new Date(start.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);

    const availableVehicles = [];

    for (let v of vehicles) {
      const overlap = await Booking.findOne({
        vehicleId: v._id,
        startTime: { $lt: end },
        endTime: { $gt: start },
      });

      if (!overlap) {
        availableVehicles.push({
          ...v.toObject(),
          estimatedRideDurationHours,
        });
      }
    }

    res.setHeader("Cache-Control", "no-store");
    res.json(availableVehicles);
  } catch (err) {
    next(err);
  }
};


module.exports = { addVehicle, getAvailableVehicles };
