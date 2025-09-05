import React, { useState, useEffect } from "react";
import api from "../services/api";
import VehicleCard from "../components/VehicleCard";
import "../App.css";
import { useForm } from "react-hook-form";


function SearchBook() {
  const [vehicles, setVehicles] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setFocus,
  } = useForm();
  const getFormData=getValues()


  const onSearch = async (data) => {
    
  try {
    
    const payload = { ...data };
    if (payload.startTime) {
      payload.startTime = new Date(payload.startTime).toISOString();
    }
    const res = await api.get("/vehicles/available", { params: payload });
    setVehicles(res.data);
   
  } catch {
    
  }
};


   React.useEffect(() => {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        setFocus(firstErrorField);
      }
    }, [errors, setFocus]);
  return (
    <div className="card">
      <h2>Search & Book Vehicle</h2>
      <form onSubmit={handleSubmit(onSearch)}>
        {/* Capacity Required */}
         <label>
          {errors.capacityRequired && (
            <span className="error-text">{errors.capacityRequired.message}</span>
          )}
        </label>
        <input  className={`input ${errors.capacityRequired ? "error" : ""}`}
          type="number"
          min={1}
          placeholder="Capacity"
          {...register("capacityRequired", {
            required: "Capacity is required",
          })}
        />

         <label>
          {errors.fromPincode && (
            <span className="error-text">{errors.fromPincode.message}</span>
          )}
        </label>
        <input  className={`input ${errors.fromPincode ? "error" : ""}`}
          type="text"
          placeholder="From Pincode"
          {...register("fromPincode",{
            required: "From Pincode is required"
          })}
        />

      <label>
          {errors.toPincode && (
            <span className="error-text">{errors.toPincode.message}</span>
          )}
        </label>
        <input  className={`input ${errors.toPincode ? "error" : ""}`} type="text"
         placeholder="To Pincode" {...register("toPincode",{
          required: "To Pincode is required",
         })} />

        <label>
          {errors.startTime && (
            <span className="error-text">{errors.startTime.message}</span>
          )}
        </label>
        <input  className={`input ${errors.startTime ? "error" : ""}`} type="datetime-local" 
        min={new Date().toISOString().slice(0, 16)} 
        {...register("startTime",{
          required: "Start Time is required",
        })} />

        <button type="submit">Search Availability</button>
      </form>

      {vehicles.map((v) => (
        <VehicleCard key={v._id} vehicle={v} searchForm={getFormData} />
      ))
    }
    </div>
  );
}

export default SearchBook;
