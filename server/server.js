const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
dotenv.config();
if (process.env.NODE_ENV !== "test") {
  connectDB();
}
const app = express();
app.use(cors());
app.use(express.json());
app.get("/",(req,res,next)=>{
  res.status(200).json({message:"h!..."})
})
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
const { errorHandler } = require("./middleware/errorMiddleware");
app.use(errorHandler);
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app; 
