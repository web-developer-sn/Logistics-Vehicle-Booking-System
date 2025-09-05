import React from "react";
import api from "../services/api";
import "../App.css";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

function AddVehicle() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let res = await api.post("/vehicles", data);
      if (res.data.action === "success") {
        toast.success(res.data.message);
      }
      reset(); 
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("All fields required");
      }
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
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
       
        <label>
         
          {errors.name && (
            <span className="error-text">{errors.name.message}</span>
          )}
        </label>
        <input
          type="text"
          placeholder="Vehicle Name"
          className={`input ${errors.name ? "error" : ""}`}
          {...register("name", { required: "Vehicle name is required" })}
        />

      
        <label>
        
          {errors.capacityKg && (
            <span className="error-text">{errors.capacityKg.message}</span>
          )}
        </label>
        <input
          type="number"
          placeholder="Capacity (Kg)"
          className={`input ${errors.capacityKg ? "error" : ""}`}
          {...register("capacityKg", { required: "Capacity is required" })}
        />

     
        <label>
          
          {errors.tyres && (
            <span className="error-text">{errors.tyres.message}</span>
          )}
        </label>
        <input
          type="number"
          placeholder="Tyres"
          className={`input ${errors.tyres ? "error" : ""}`}
          {...register("tyres", { required: "Tyres count is required" })}
        />

        <button type="submit">Add Vehicle</button>
      </form>
    </div>
  );
}

export default AddVehicle;
