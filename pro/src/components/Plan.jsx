import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Plan.css";

const Plans = () => {
  const navigate = useNavigate();

  return (
    <section className="plans-section">
      <h2 className="plans-title">Our Membership Plans</h2>
      <p className="plans-subtitle">
        Choose the perfect plan for your fitness journey
      </p>

      <div className="plans-container">
        {/* Basic Plan */}
        <div className="plan-card">
          <h3>Basic</h3>
          <p className="price">₹6k/3mo</p>
          <ul>
            <li>✔ Full Gym Access</li>
            <li>✔ Access to all Equipment</li>
            <li>✔ Group / General Trainers for help</li>
            <li>❌ No Personal Trainers</li>
            <li>❌ No Nutritionist Support</li>
          </ul>
          <button
            className="plan-btn"
            onClick={() =>
              navigate("/membership", { state: { plan: "Basic" } })
            }
          >
            Choose Basic
          </button>
        </div>

        {/* Pro Plan */}
        {/* Pro Plan */}
        <div className="plan-card">
          <h3>Pro</h3>
          <p className="price">₹12k/6mo</p>
          <ul>
            <li>✔ Full Gym Access</li>
            <li>✔ Access to all Equipment</li>
            <li>✔ Personal Trainers Included</li>
            <li>❌ Nutritionist Support</li>
          </ul>
          <button
            className="plan-btn"
            onClick={() => navigate("/membership", { state: { plan: "Pro" } })}
          >
            Choose Pro
          </button>
        </div>

        {/* Premium Plan */}
        {/* Premium Plan */}
        <div className="plan-card pro-plan">
          <div className="popular-badge">Most Popular</div>
          <h3>Premium</h3>
          <p className="price">₹20k/12mo</p>
          <ul>
            <li>✔ Full Gym Access</li>
            <li>✔ Access to all Equipment</li>
            <li>✔ Personal Trainers Included</li>
            <li>✔ Nutritionist Support</li>
          </ul>
          <button
            className="plan-btn"
            onClick={() =>
              navigate("/membership", { state: { plan: "Premium" } })
            }
          >
            Choose Premium
          </button>
        </div>
      </div>
    </section>
  );
};

export default Plans;
