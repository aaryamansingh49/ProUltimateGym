import React, { useState, useEffect } from "react";
// import { saveProfile } from "../../api/profileApi";
import "../../styles/dashboard/profileSetup.css";

const isNewUser = localStorage.getItem("isNewUser") === "true";

const ProfileSetup = ({ profile, onSubmit, onClose }) => {

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    age: profile?.age || "",
    height: profile?.height || "",
    weight: profile?.weight || "",
    goal: profile?.goal || "",
    gender: profile?.gender || "",
    level: profile?.level || "",
    targetWeight: profile?.targetWeight || "",
    goalDuration: profile?.goalDuration || "",
    activityLevel: profile?.activityLevel || "",
    workoutPreference: profile?.workoutPreference || "",
    dietPreference: profile?.dietPreference || "",
    focusArea: profile?.focusArea || "",
  });

  const [errors, setErrors] = useState({});
  const [healthyRange, setHealthyRange] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    if (name === "height") {
      if (value < 120 || value > 230) {
        newErrors.height =
          "Please enter a valid height between 120 cm and 230 cm.";
      } else {
        delete newErrors.height;
      }
    }

    if (name === "weight") {
      if (value < 35 || value > 250) {
        newErrors.weight =
          "Please enter a valid weight between 35 kg and 250 kg.";
      } else {
        delete newErrors.weight;
      }
    }

    setErrors(newErrors);
  };

  useEffect(() => {
    if (formData.height) {
      const heightM = formData.height / 100;

      const minWeight = (18.5 * heightM * heightM).toFixed(1);
      const maxWeight = (24.9 * heightM * heightM).toFixed(1);

      setHealthyRange({
        min: minWeight,
        max: maxWeight,
      });
    }
  }, [formData.height]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (errors.height || errors.weight) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const payload = {
        ...formData,
      };

      onSubmit(payload);

      localStorage.removeItem("isNewUser");

    } catch (error) {
      console.error("Profile submit error:", error);
    }
  };

  return (
    <div className="profile-setup-overlay">
      <div className="profile-setup-card">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h2>Complete Your Profile</h2>
        <p className="subtitle">Please set up your body details</p>

        <form onSubmit={handleSubmit}>

          {!profile?.name && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter your name"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
            {errors.height && (
              <p style={{ color: "red", fontSize: "13px" }}>
                {errors.height}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
            {errors.weight && (
              <p style={{ color: "red", fontSize: "13px" }}>
                {errors.weight}
              </p>
            )}
          </div>

          {healthyRange && (
            <p
              style={{
                fontSize: "13px",
                color: "#16a34a",
                marginBottom: "10px",
              }}
            >
              Based on your height, your healthy weight should be between{" "}
              <strong>
                {healthyRange.min} kg – {healthyRange.max} kg
              </strong>
            </p>
          )}

          <div className="form-group">
            <label>Fitness Goal</label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Fat Loss">Fat Loss</option>
              <option value="Bulking">Bulking</option>
            </select>
          </div>

          <div className="form-group">
  <label>Target Weight (kg)</label>
  <input
    type="number"
    name="targetWeight"
    value={formData.targetWeight}
    onChange={handleChange}
  />

  {healthyRange &&
    formData.targetWeight &&
    Number(formData.targetWeight) < Number(healthyRange.min) && (
      <p style={{ color: "#f59e0b", fontSize: "13px" }}>
        Warning: This target weight is too low for your height and may lead to underweight.
      </p>
    )}

  {healthyRange &&
    formData.targetWeight &&
    Number(formData.targetWeight) > Number(healthyRange.max) && (
      <p style={{ color: "#ef4444", fontSize: "13px" }}>
        Warning: This target weight is higher than the healthy range and may lead to overweight.
      </p>
    )}
</div>

          <div className="form-group">
            <label>Goal Duration</label>
            <select
              name="goalDuration"
              value={formData.goalDuration}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="1 month">1 Month</option>
              <option value="3 months">3 Months</option>
              <option value="6 months">6 Months</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fitness Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="">Select Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label>Activity Level</label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Moderate">Moderate</option>
              <option value="Active">Active</option>
            </select>
          </div>

          <div className="form-group">
            <label>Workout Preference</label>
            <select
              name="workoutPreference"
              value={formData.workoutPreference}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Gym Training">Gym Training</option>
              <option value="Home Workout">Home Workout</option>
              <option value="CrossFit">CrossFit</option>
              <option value="Calisthenics">Calisthenics</option>
              <option value="Cardio Focus">Cardio Focus</option>
            </select>
          </div>

          <div className="form-group">
            <label>Diet Preference</label>
            <select
              name="dietPreference"
              value={formData.dietPreference}
              onChange={handleChange}
              required
            >
              <option value="">Select Diet</option>
              <option value="veg">Veg</option>
              <option value="non-veg">Non Vegetarian</option>
              <option value="keto">Keto</option>
              <option value="vegan">Vegan</option>
              <option value="balanced">Balanced</option>
            </select>
          </div>

          <div className="form-group">
            <label>Focus Area</label>
            <select
              name="focusArea"
              value={formData.focusArea}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Full Body">Full Body</option>
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Legs">Legs</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Arms">Arms</option>
              <option value="Abs/Core">Abs/Core</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Save & Continue
          </button>

        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;