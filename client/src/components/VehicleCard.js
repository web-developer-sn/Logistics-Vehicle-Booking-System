import* as React from "react";
import api from "../services/api";
import "../App.css";
import { toast } from "react-toastify";

function VehicleCard({ vehicle, searchForm }) {

  const handleBook = async () => {
    try {
      
     const res= await api.post("/bookings", {
        vehicleId: vehicle._id,
        fromPincode: searchForm.fromPincode,
        toPincode: searchForm.toPincode,
        startTime: searchForm.startTime,
        customerId: "cust123",
      });
      if(res.data.action==="success"){
        toast.success(res.data.message)
      }
        if(res.data.action==="error"){
        toast.error(res.data.message)
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Vehicle already booked")
      };
     
    }
  };

  return (
    <div className="card">
      <h3>{vehicle.name}</h3>
      <p>Capacity: {vehicle.capacityKg} Kg</p>
      <p>Tyres: {vehicle.tyres}</p>
      <p>Duration: {vehicle.estimatedRideDurationHours} hrs</p>
      <button onClick={handleBook}>Book Now</button>
    
    </div>
  );
}

export default VehicleCard;
