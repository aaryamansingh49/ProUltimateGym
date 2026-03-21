import React, { useEffect, useState } from "react";
import "../../styles/dashboard/achievements.css";
import { getUserWorkouts } from "../../api/profileApi";

const Achievements = ({ profile }) => {

  const [achievements, setAchievements] = useState([]);
  const [animatedAchievements, setAnimatedAchievements] = useState([]);

  useEffect(() => {

    const userKey = localStorage.getItem("userKey");
    if (!userKey) return;

    const fetchAchievements = async () => {

      try {

        const res = await getUserWorkouts(userKey);
        if (!res.success) return;

        const workouts = res.workouts || [];
        const result = [];

        /* =========================
           ⭐ TOTAL WORKOUT COUNT
        ========================= */

        result.push({
          title: "Total Workouts",
          desc: `${workouts.length} sessions`,
          progress: 100
        });

        /* =========================
           ⭐ PERSONAL BEST CALORIES
        ========================= */

        const bestCalories = workouts.length
          ? Math.max(...workouts.map(w => w.totalCalories || 0))
          : 0;

        result.push({
          title: "Personal Best",
          desc: `${bestCalories} kcal`,
          progress: 100
        });

        /* =========================
           ⭐ TOTAL CALORIES BURNED
        ========================= */

        const totalCalories = workouts.reduce(
          (sum, w) => sum + (w.totalCalories || 0),
          0
        );

        result.push({
          title: "Total Calories Burned",
          desc: `${totalCalories} kcal`,
          progress: 100
        });

        /* =========================
           ⭐ CURRENT WORKOUT STREAK
        ========================= */

        let streak = 0;

        if (workouts.length > 0) {

          const sorted = [...workouts].sort(
            (a,b) => new Date(b.date) - new Date(a.date)
          );

          streak = 1;

          for(let i=0;i<sorted.length-1;i++){

            const current = new Date(sorted[i].date);
            const next = new Date(sorted[i+1].date);

            const diff = Math.floor(
              (current-next)/(1000*60*60*24)
            );

            if(diff===1) streak++;
            else break;

          }
        }

        result.push({
          title:"Workout Streak",
          desc:`${streak} days`,
          progress:100
        });

        /* =========================
           ⭐ LONGEST STREAK EVER
        ========================= */

        let longestStreak = 0;

        if(workouts.length > 0){

          const sortedAsc = [...workouts].sort(
            (a,b)=> new Date(a.date)-new Date(b.date)
          );

          let currentStreak = 1;

          for(let i=0;i<sortedAsc.length-1;i++){

            const d1 = new Date(sortedAsc[i].date);
            const d2 = new Date(sortedAsc[i+1].date);

            const diff = Math.floor(
              (d2-d1)/(1000*60*60*24)
            );

            if(diff===1){
              currentStreak++;
              longestStreak = Math.max(longestStreak,currentStreak);
            }else{
              currentStreak=1;
            }

          }
        }

        result.push({
          title:"Longest Streak",
          desc:`${longestStreak} days`,
          progress:100
        });

        /* =========================
           ⭐ WEEKLY ACTIVITY SCORE
        ========================= */

        const now = new Date();

        const weeklyWorkouts = workouts.filter(w =>
          (now - new Date(w.date)) <= 7*24*60*60*1000
        );

        const weeklyScore = weeklyWorkouts.length * 10;

        result.push({
          title:"Weekly Activity",
          desc:`${weeklyScore}/100 score`,
          progress:Math.min(weeklyScore,100)
        });

        /* =========================
           ⭐ GOAL PROGRESS
        ========================= */

        const goalProgress =
          Number(localStorage.getItem(`goalProgress_${userKey}`)) || 0;

        result.push({
          title:"Goal Progress",
          desc:`${Math.round(goalProgress)}% completed`,
          progress:goalProgress
        });

        /* =========================
           ⭐ NUTRITION DISCIPLINE
        ========================= */

        const nutrition =
          Number(localStorage.getItem(`nutritionPercent_${userKey}`)) || 0;

        result.push({
          title:"Nutrition Discipline",
          desc:`${Math.round(nutrition * 100)}%`,
          progress:Math.min(nutrition * 100,100)
        });

        setAchievements(result);

        setTimeout(()=>{
          setAnimatedAchievements(result);
        },100);

      } catch(err){
        console.log(err);
      }

    };

    fetchAchievements();

  },[profile]);


  return (

    <div className="achievements-container">

      <h2 className="achievements-title">🏆 Achievements</h2>

      <div className="achievement-grid">

        {achievements.map((item,index)=>{

          const ringColor =
            item.progress>80
              ? "#00E676"
              : item.progress>50
              ? "#FFC107"
              : "#FF5252";

          return(

          <div key={index} className="achievement-card">

            <div className="ring">

              <svg viewBox="0 0 80 80">

                <circle cx="40" cy="40" r="35"
                  stroke="#eee"
                  strokeWidth="6"
                  fill="none"
                />

                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke={ringColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    strokeDasharray:220,
                    strokeDashoffset:
                      220-(220*(animatedAchievements[index]?.progress||0))/100,
                    transition:"stroke-dashoffset 1.3s ease",
                    filter:"drop-shadow(0 0 8px rgba(0,255,150,0.6))"
                  }}
                />

              </svg>

              <span>
                {item.title==="Total Workouts" && "🏋️"}
                {item.title==="Personal Best" && "🏆"}
                {item.title==="Total Calories Burned" && "⚡"}
                {item.title==="Workout Streak" && "🔥"}
                {item.title==="Longest Streak" && "🥇"}
                {item.title==="Weekly Activity" && "📊"}
                {item.title==="Goal Progress" && "🎯"}
                {item.title==="Nutrition Discipline" && "🍽️"}
              </span>

            </div>

            <div className="achievement-content">
              <h3 className="achievement-title-text">{item.title}</h3>
              <p className="achievement-value">{item.desc}</p>
            </div>

          </div>

        )})}

      </div>

    </div>

  );

};

export default Achievements;