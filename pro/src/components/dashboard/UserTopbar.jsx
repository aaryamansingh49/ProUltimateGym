import React, { useEffect, useState } from "react";
import "../../styles/dashboard/topbar.css";

const UserTopbar = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("userProfile"));

    if (profile?.firstName) {
      setUserName(profile.firstName);
    } else if (profile?.name) {
      setUserName(profile.name);
    } else if (profile?.fullName) {
      setUserName(profile.fullName);
    } else if (profile?.email) {
      setUserName(profile.email.split("@")[0]);
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
