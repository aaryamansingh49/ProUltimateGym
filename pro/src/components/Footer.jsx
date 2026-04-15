import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { IoLocationSharp, IoMailSharp, IoCallSharp } from "react-icons/io5";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Logo & Description */}
        <div className="footer-section">
        <h2 className="footer-brand">
    <span className="pro">Pro</span> <span className="ultimate"> Ultimate Gyms </span>
  </h2>
          <p>Pro Ultimate Gyms  is the brand with a difference. We have all the essentials you need for a great workout.</p>
          <div className="footer-icons">
            <FaFacebookF />
            <FaInstagram />
            <FaYoutube />
            <FaLinkedinIn />
          </div>
        </div>

        {/* Useful Links */}
        <div className="footer-section">
          <h3>Useful Links</h3>
          <ul>
            <li>All Access Card</li>
            <li>All Access Request Form</li>
            <li>Upgrade & Transfer Policy</li>
            <li>Freezing Policy</li>
            <li>Events & News</li>
            <li>Gym Solutions</li>
            <li>Contact us</li>
            <li>Pro Ultimate Gyms Franchise</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Corporate Office</h3>
          <p><IoLocationSharp /> Plot no. 18, 19, Sector 82, Punjab 160055</p>
          <p><IoMailSharp /> support@proultimategyms.in</p>
          <p><IoCallSharp /> 9056142100</p>
        </div>
      </div>

      {/* Bottom Section */}
      {/* Bottom Section */}
<div className="footer-bottom">
  <p>
     <span className="red-text">2025. All Rights Reserved.</span> | Created By: Aaryaman Singh.
  </p>
</div>


    </footer>
  );
};

export default Footer;
