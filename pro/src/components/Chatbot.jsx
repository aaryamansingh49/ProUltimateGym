// src/components/ChatBot.jsx
import React, { useState, useEffect } from "react";
import "../styles/Chatbot.css"; // Create this CSS file for styling
import botIcon from "../assets/bot-icon2.jpg"; // use your bot icon image
import axios from "axios";
import BASE_URL from "../api/config.js";
const API_BASE = BASE_URL;




const chatbotData = [
  {
    question: "What is the current price of membership?",
    type: "multi-option",
    options: [ 6, 9, 12],
    responseMap: {
      6: "₹6000 for 6 months",
      9: "₹12000 for 9 months",
      12: "₹20000 for 12 months"
    }
  },
  {
    question: "Do you offer personal training?",
    type: "static",
    response: "Yes, we offer personal training with 6, 9, and 12-month plans."
  },
  {
    question: "What are the gym timings?",
    type: "static",
    response: "Our gym is open from 5 AM to 10 PM, 7 days a week."
  },
  {
    question: "Do you offer online coaching?",
    type: "static",
    response: "Yes, online coaching is available under the 9 and 12-month plans."
  },
  {
    key: "membership_expiry",
    question: "When my membership will expire?",
    type: "protected",
    loginRequired: true,
    responseIfLoggedOut: "Please login to check your membership details."
  },
  {
    question: "Which coach will train me?",
    type: "protected",
    loginRequired: true,
    responseIfLoggedOut: "Login to see your assigned coach."
  }
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [response, setResponse] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showHello, setShowHello] = useState(false);

  const username = localStorage.getItem("username"); 
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("userEmail");

  const isLoggedIn = token && email; 

  useEffect(() => {
    setShowHello(true);
    const timer = setTimeout(() => {
      setShowHello(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);


  const handleQuestionClick = async (item) => {
    setSelectedMonth(null);
    setSelectedQuestion(item);
    setResponse("");
  
    if (item.type === "static") {
      setResponse(item.response);
    } else if (item.type === "protected") {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");
  
      if (!token || !email) {
        setResponse(item.responseIfLoggedOut);
        return;
      }
  
      try {
        let apiUrl = "";
        let postData = { token, email };
  
        if (item.question.includes("membership")) {
          apiUrl = `${API_BASE}/api/membership/end-date`;
        } else if (item.question.includes("coach")) {
          apiUrl = `${API_BASE}/api/coach/assigned`;
        }
        
  
        const res = await axios.post(apiUrl, postData);
  
        if (item.key === "membership_expiry") {
          console.log("API RESPONSE:", res.data);
        
          const endDate = res.data?.endDate;
        
          if (!endDate || endDate === "Invalid Date") {
            setResponse("Membership end date not available. Please contact admin.");
          } else {
            setResponse(`Your membership will end on ${endDate}`);
          }
        }
        else if (item.question.includes("coach")) {
          setResponse(`Your assigned coach is ${res.data.coach}`);
        }
      } catch (error) {
        console.error("API Error:", error);
        setResponse(error.response?.data?.message || "Error fetching data.");
      }
    }
  };
  
  
  
  const handleMonthClick = (month) => {
    setSelectedMonth(month);
    setResponse(selectedQuestion.responseMap[month]);
  };

  return (
    <div className="chatbot-container">
      {!open && (
        <div className="floating-bot-button" onClick={() => setOpen(true)}>
          <img src={botIcon} alt="Bot" width="50" />
          {showHello && <div className="hello-tooltip">Hello!</div>}
        </div>
      )}

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>Ask a Question</h4>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chatbot-body">
            {!showMenu ? (
              <>
                <div className="chatbot-response">
                  Welcome to Pro Ultimate{username ? `, ${username}` : ""}
                </div>
                <button
                  className="menu-button"
                  onClick={() => setShowMenu(true)}
                >
                  Show Menu
                </button>
              </>
            ) : (
              <>
                {chatbotData.map((item, index) => (
                  <div
                    key={index}
                    className="chatbot-question"
                    onClick={() => handleQuestionClick(item)}
                  >
                    {item.question}
                  </div>
                ))}

                {selectedQuestion && selectedQuestion.type === "multi-option" && (
                  <div className="chatbot-options">
                    {selectedQuestion.options.map((month) => (
                      <button key={month} onClick={() => handleMonthClick(month)}>
                        {month} Months
                      </button>
                    ))}
                  </div>
                )}

                {response && <div className="chatbot-response">{response}</div>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;