import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import { EffectFade, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/home.css";
import Plan from "./Plan";
import "../styles/Plan.css";

import bannerImage from "../assets/homepro.png";
import proImage from "../assets/homepro2.png";
import proWeightTraining from "../assets/weighttraining.png";
import proCardio from "../assets/cardio.jpg";
import proYoga from "../assets/yoga.jpg";
import proZumba from "../assets/zumba.jpg";
import proDance from "../assets/dance.png";
import Probdprep from "../assets/bdprep3.png";
import Proplprep from "../assets/plprep.jpg";
import Pronp from "../assets/np.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [swiperInstance, setSwiperInstance] = useState(null);


  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <div className="home-container">
      {/* Background Swiper */}
      <div className="swiper-wrapper">
        <Swiper
          modules={[EffectFade, Autoplay]}
          effect="fade"
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="swiper-container"
          onSwiper={(swiper) => setSwiperInstance(swiper)}
        >
          <SwiperSlide>
            <motion.img
              src={bannerImage}
              alt="Pro Ultimate Gym Banner"
              className="banner-img"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <motion.img
              src={proImage}
              alt="Pro Ultimate Gym Slide 2"
              className="banner-img"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />
          </SwiperSlide>
        </Swiper>

        {/* Navigation Buttons */}
        <button
          className="prev-btn"
          onClick={() => swiperInstance?.slidePrev()}
        >
          ❮
        </button>
        <button
          className="next-btn"
          onClick={() => swiperInstance?.slideNext()}
        >
          ❯
        </button>
      </div>

      {/* Welcome Section with Animation */}
      <div className="welcome-section">
        <motion.div
          className="welcome-image"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img
            src="https://content3.jdmagicbox.com/comp/yamunanagar/d9/9999p1732.1732.230224113143.p9d9/catalogue/pro-ultimate-gyms-yamuna-nagar-yamunanagar-women-gyms-swng5p48au.jpg"
            alt="Gym Reception"
            className="reception-img"
          />
        </motion.div>

        <motion.div
          className="welcome-text"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.3 },
            },
          }}
        >
          <motion.h2
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Welcome To
          </motion.h2>

          <motion.h2
            className="highlight"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
          Ultimate Fitness Club
          </motion.h2>

          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          >
            Ultimate Fitness Club is a rapidly growing gym franchise that is
            dedicated to helping individuals achieve their fitness goals. With
            45+ branches across the country, Pro Ultimate Gyms provides
            state-of-the-art equipment, knowledgeable trainers, and a supportive
            community to help members get fit and stay healthy.
          </motion.p>

          <motion.button
            className="ct-btn"
            onClick={() => navigate("/about")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>

      {/* Services Section */}
      <div className="gym-services-container">
        <h2>
          Our <span className="gym-highlight-text">Services</span>
        </h2>
        <div className="gym-services-grid">
          <div className="gym-service-card" data-aos="fade-up" data-aos-delay="100">
            <img src={proWeightTraining} alt="Weight Training" />
            <h3>Weight Training</h3>
            <p>Get 1-on-1 coaching with expert trainers.</p>
            <button
              className="gym-learn-btn"
              onClick={() => navigate("/services")}
            >
              Learn More
            </button>
          </div>

          <div className="gym-service-card" data-aos="fade-up" data-aos-delay="200">
            <img src={proCardio} alt="Cardio" />
            <h3>Cardio</h3>
            <p>High-energy workouts for all fitness levels.</p>
            <button
              className="gym-learn-btn"
              onClick={() => navigate("/services")}
            >
              Learn More
            </button>
          </div>

          <div className="gym-service-card" data-aos="fade-up" data-aos-delay="300">
            <img src={proYoga} alt="Zumba" />
            <h3>Zumba</h3>
            <p>Fun and energetic dance workouts.</p>
            <button
              className="gym-learn-btn"
              onClick={() => navigate("/services")}
            >
              Learn More
            </button>
          </div>

          <div className="gym-service-card" data-aos="fade-up" data-aos-delay="400">
            <img src={proZumba} alt="Yoga" />
            <h3>Yoga</h3>
            <p>Improve flexibility and mental well-being.</p>
            <button
              className="gym-learn-btn"
              onClick={() => navigate("/services")}
            >
              Learn More
            </button>
          </div>

          <div className="gym-service-card" data-aos="fade-up" data-aos-delay="500">
            <img src={proDance} alt="Dance" />
            <h3>Dance</h3>
            <p>Express yourself and stay fit through dance.</p>
            <button
              className="gym-learn-btn"
              onClick={() => navigate("/services")}
            >
              Learn More
            </button>
          </div>

          <div className="gym-service-card" data-aos="fade-up" data-aos-delay="600">
            <img src={Probdprep} alt="BodyBuilding Prep" />
            <h3>BodyBuilding Prep</h3>
            <p>
              Comprehensive training and better conditioning for competitions.
            </p>
            <button
              className="gym-learn-btn"
              onClick={() => navigate("/services")}
            >
              Learn More
            </button>
          </div>

          <div className="gym-service-card" data-aos="fade-up" data-aos-delay="700">
            <img src={Proplprep} alt="PowerLifting Prep" />
            <h3>PowerLifting Prep</h3>
            <p>Specialized strength training for competitions.</p>
            <button
              className="gym-learn-btn"
              onClick={() => navigate("/services")}
            >
              Learn More
            </button>
          </div>

          <div className="gym-service-card" data-aos="fade-up" data-aos-delay="800">
            <img src={Pronp} alt="Nutrition Plans" />
            <h3>Nutrition Plans</h3>
            <p>Custom diets for muscle gain, fat loss, or performance.</p>
            <button
              className="gym-learn-btn"
              onClick={() => navigate("/services")}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
      <Plan />   
    </div>
  );
};

export default Home;
