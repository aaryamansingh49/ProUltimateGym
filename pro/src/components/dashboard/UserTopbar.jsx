import React, { useEffect, useState } from "react";
import "../../styles/dashboard/topbar.css";

const UserTopbar = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("userProfile"));

    if (profile?.name) {
      setUserName(profile.name);
    } else if (profile?.fullName) {
      setUserName(profile.fullName);
    } else {
      setUserName("");
    }
  }, []);

  return (
    <div className="topbar">
      <h2>
        {userName ? (
          <>
            Hello, <span>{userName}</span> 
          </>
        ) : (
          "Dashboard"
        )}
      </h2>
      <span>{new Date().toDateString()}</span>
    </div>
  );
};

export default UserTopbar;
