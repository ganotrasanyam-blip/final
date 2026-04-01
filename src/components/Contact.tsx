import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href="mailto:ganotrasanyam@gmail.com"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                Email — ganotrasanyam@gmail.com
              </a>
            </p>
            <p>
              <a
                href="https://www.linkedin.com/in/sanyam-ganotra-2712b42"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                LinkedIn — sanyam-ganotra
              </a>
            </p>
            <h4>Education</h4>
            <p>
              Bachelor of Arts (Economics & English), Motilal Nehru College, Delhi University — 2024 [cite: 34, 35, 36, 37]
            </p>
            <p>
              High School Diploma, West Academy Sr. Sec School — 2020 [cite: 29, 30, 31]
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://www.linkedin.com/in/sanyam-ganotra-2712b42"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/sanyamg__/?hl=en"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
            <a
              href="mailto:ganotrasanyam@gmail.com"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Email <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Sanyam Ganotra</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;