import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import BASE_URL from "../api/config";
import toast from "react-hot-toast";

const ProtectedUserRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!token) {
        setIsAllowed(false);
        setLoading(false);
        return;
      }

      const email =
        JSON.parse(localStorage.getItem("userProfile"))?.email ||
        localStorage.getItem("userEmail");

      try {
        const res = await fetch(
          `${BASE_URL}/api/check-active-membership?email=${email}`
        );

        const data = await res.json();

        if (data.isActive) {
          setIsAllowed(true);
        } else {
          // 🔥 YAHI USE HOGA TOAST
          toast.error("Only active members can access this feature");

          setTimeout(() => {
            navigate("/membership");
          }, 1500);
        }
      } catch (err) {
        console.error(err);
        navigate("/membership");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [token, navigate]);

  if (loading) return <div>Checking access...</div>;

  if (!token) return <Navigate to="/login" />;

  if (!isAllowed) return null;

  return children;
};

export default ProtectedUserRoute;