export const updateGoalProgress = () => {

    const userKey = localStorage.getItem("userKey");
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  
    if (!userKey || !userProfile) return;
  
    let durationDays = 90;
  
    if (userProfile.goalDuration === "1 month") durationDays = 30;
    if (userProfile.goalDuration === "3 months") durationDays = 90;
    if (userProfile.goalDuration === "6 months") durationDays = 180;
    if (userProfile.goalDuration === "12 months") durationDays = 365;
  
    const progressPerDay = 100 / durationDays;
  
    let currentProgress =
      Number(localStorage.getItem(`goalProgress_${userKey}`)) || 0;
  
    currentProgress += progressPerDay;
  
    if (currentProgress > 100) currentProgress = 100;
  
    localStorage.setItem(`goalProgress_${userKey}`, currentProgress);
  
  };