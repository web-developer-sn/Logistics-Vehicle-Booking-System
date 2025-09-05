const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const createBooking = async (req, res, next) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;
    if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) {
      return res.status(400).json({ message: "All fields required" ,action:"error"});
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" ,action:"error"});

    const estimatedRideDurationHours =
      Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
    const start = new Date(startTime);
    const end = new Date(start.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);

    const conflict = await Booking.findOne({
      vehicleId,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });
    if (conflict) return res.status(409).json({ message: "Vehicle already booked",action:"error" });

    const booking = await Booking.create({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId,
    });

    res.status(201).json({...booking.toObject(),message:"Booking successfully",action:"success"});
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking };
