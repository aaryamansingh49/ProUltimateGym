import React, { useEffect, useState, useRef } from "react";
import "../styles/About.css";
import trainer1 from "../assets/yoga.jpg";

// ✅ React Icons
import { GiWeightLiftingUp } from "react-icons/gi";
import {
  FaEye,
  FaCalendarAlt,
  FaRedo,
  FaHandshake,
  FaGraduationCap,
  FaDumbbell,
  FaClock,
  FaTrophy,
} from "react-icons/fa";

// Count-up component
const StatBox = ({ number, label }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statRef.current) observer.observe(statRef.current);

    return () => {
      if (statRef.current) observer.unobserve(statRef.current);
      observer.disconnect();
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let start = 0;
    const end = parseInt(number, 10);
    if (isNaN(end)) return;

    const duration = 700;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasAnimated, number]);

  return (
    <div className="stat-card" ref={statRef}>
      <span className="stat-number">{count}+</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

const About = () => {
  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <h1> PRO ULTIMATE GYMS</h1>
        <p>YOUR ULTIMATE FITNESS DESTINATION</p>
      </div>

      {/* Story */}
      <section className="our-story">
        <img src={trainer1} alt="Our Story" />
        <div className="story-text">
          <h2>Our Story</h2>
          <p>
            <strong>
              “From a single dream to India’s fastest-growing fitness family.”
            </strong>
          </p>
          <p>
            {" "}
            Pro Ultimate Gyms began with a small 700 sq ft facility and a
            passionate vision — to make fitness not just a routine, but a
            lifestyle. What started as a humble setup soon turned into a
            movement that redefined what a gym could be.{" "}
          </p>{" "}
          <p>
            {" "}
            Over the years, Pro Ultimate Gyms has evolved beyond weights and
            machines — it has become a <strong>community of achievers</strong>,
            guided by certified trainers, equipped with advanced technology, and
            powered by motivation. Through our expanding network across North
            India, we have helped thousands transform their bodies and minds.{" "}
          </p>{" "}
          <p>
            {" "}
            Every milestone in our journey represents not just the growth of a
            brand, but the transformation of countless lives. We believe true
            fitness comes from consistency, discipline, and support — values
            that are deeply rooted in our foundation.{" "}
          </p>{" "}
          <p>
            {" "}
            From premium interiors and modern equipment to group training zones
            and personal coaching, we have built a space where members don’t
            just work out — <strong>they belong.</strong>{" "}
          </p>{" "}
          <p>
            {" "}
            Our mission remains simple yet powerful: to empower individuals to
            become the best version of themselves. As we continue to grow, we
            stay committed to being{" "}
            <strong> “Your Ultimate Fitness Destination.”</strong>{" "}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <h2>Our Mission & Vision</h2>

        <div className="mission-vision-cards">
          <div className="card">
            <div className="icon">
              <GiWeightLiftingUp className="icon-mission" />
            </div>
            <h3>Our Mission</h3>
            <p>
              Helping people reach their fitness goals through dedication and
              expert guidance.
            </p>
          </div>

          <div className="card">
            <div className="icon">
              <FaEye className="icon-vision" />
            </div>
            <h3>Our Vision</h3>
            <p>
              To be India’s leading gym brand, inspiring transformation and
              healthy living.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="philosophy-section">
        <h2>Our Training Philosophy</h2>
        <p className="philosophy-subtitle">
          Three pillars that shape every transformation at Pro Ultimate Gyms.
        </p>

        <div className="philosophy-grid">
          <div className="philosophy-card">
            <div className="philosophy-icon">
              <FaCalendarAlt className="icon-discipline" />
            </div>
            <h3>Discipline</h3>
            <p>Structured workout plans...</p>
          </div>

          <div className="philosophy-card">
            <div className="philosophy-icon">
              <FaRedo className="icon-consistency" />
            </div>
            <h3>Consistency</h3>
            <p>Daily habits over quick fixes...</p>
          </div>

          <div className="philosophy-card">
            <div className="philosophy-icon">
              <FaHandshake className="icon-support" />
            </div>
            <h3>Support</h3>
            <p>Guidance at every step...</p>
          </div>
        </div>
      </section>

      {/* WHY PRO */}
      <section className="why-pro">
        <h2>Why Pro Ultimate Gyms?</h2>

        <div className="why-cards">
          <div className="why-card">
            <div className="why-icon-wrapper">
              <FaGraduationCap className="icon-trainer" />
            </div>
            <h3>Certified Trainers</h3>
            <p>Trained professionals...</p>
          </div>

          <div className="why-card">
            <div className="why-icon-wrapper">
              <FaDumbbell className="icon-equipment" />
            </div>
            <h3>Premium Equipment</h3>
            <p>State-of-the-art machines...</p>
          </div>

          <div className="why-card">
            <div className="why-icon-wrapper">
              <FaClock className="icon-time" />
            </div>
            <h3>Flexible Memberships</h3>
            <p>Multiple plans...</p>
          </div>

          <div className="why-card">
            <div className="why-icon-wrapper">
              <FaTrophy className="icon-trophy" />
            </div>
            <h3>Competition Prep</h3>
            <p>Specialized coaching...</p>
          </div>
        </div>
      </section>

      {/* OUR ACHIEVEMENTS */}
      <section className="achievements-section">
        <h2>Our Achievements</h2>
        <p className="achievements-subtitle">
          Recognitions that reflect our commitment to excellence in fitness.
        </p>
        <div className="achievements-grid">
          <div className="achievement-card">
            <div className="achievement-image-wrapper">
              <img
                src="https://static.wixstatic.com/media/83a9f4_d276143f265e4d6fbbb003e6c3f7ca68~mv2.png/v1/fill/w_666,h_361,al_c,lg_1,q_85,enc_avif,quality_auto/Bharat%20Pro%20Show.png"
                alt="Bharat Pro Show 2025 - New Delhi"
              />
            </div>
            <h3>Bharat Pro Show 2025 - New Delhi</h3>
            <p>
              Pro Ultimate was the title sponsor of Bharat Pro Show at IHFF.
            </p>
          </div>

          <div className="achievement-card">
            <div className="achievement-image-wrapper">
              <img
                src="https://static.wixstatic.com/media/83a9f4_e89579e1b398436eb8a411f030132288~mv2.png/v1/fill/w_666,h_361,al_c,lg_1,q_85,enc_avif,quality_auto/IHFF%20action%20Hero%20Award.png"
                alt="IHFF Action Hero Award - Mumbai"
              />
            </div>
            <h3>IHFF Action Hero Award - Mumbai</h3>
            <p>
              Recognised at IHFF for being India’s fastest growing gym chain.
            </p>
          </div>

          <div className="achievement-card">
            <div className="achievement-image-wrapper">
              <img
                src="https://static.wixstatic.com/media/83a9f4_441c76ee4cdc4962833dd28178f8644e~mv2.png/v1/fill/w_666,h_361,al_c,lg_1,q_85,enc_avif,quality_auto/Zee%20award.png"
                alt="Zee Award 2017 - New Delhi"
              />
            </div>
            <h3>Zee Award 2017 - New Delhi</h3>
            <p>
              Felicitated at the ZEE BUSINESS AWARDS for contribution to the
              fitness industry.
            </p>
          </div>
        </div>
      </section>

      {/* NUMBERS THAT SPEAK */}

      <section className="stats-section">
        <h2>Numbers That Speak</h2>

        <div className="stats-grid">
          <StatBox number={10} label="Years of Experience" />
          <StatBox number={100} label="Branches in North India" />
          <StatBox number={25000} label="Transformations" />
          <StatBox number={10000} label="Happy Members" />
        </div>
      </section>
    </div>
  );
};

export default About;
