import './about.css';

import img1 from '../../../images/map-about.png';
import img2 from '../../../images/user-about.png'
import img3 from '../../../images/Security.png'
import video from '../../../images/video1.mp4';

const About = () => {
  return (
    <section className="about">
      <div className="secContainer">
        <h2 className="title">
          Why should you choose us?
        </h2>

        <div className="mainContent container d-grid">
          <div className="singleItem">
            <img src={img1} alt="Image NAme" />

            <h3>Optimal Route Planning</h3>

            <p>
              Our AI algorithms analyze your preferences
              to craft the most efficient route, saving
              you time and effort.
            </p>
          </div>

          <div className="singleItem">
            <img src={img2} alt="Image NAme" />

            <h3>Personalize Your Adventure</h3>

            <p>
              Shape your journey by freely adding,
              editing, or deleting activities from
              your itinerary.
            </p>
          </div>

          <div className="singleItem">
            <img src={img3} alt="Image NAme" />

            <h3>Security</h3>

            <p>
              The platform provides protection for user
              information and activities while ensuring
              that they are not shared.
            </p>
          </div>
        </div>

        <div className="videoCard container">
          <div className="cardContent d-grid">

            <div data-aos="fade-right" data-aos-duration="2500" className="cardText">
              <h2>
                The only tool you'll ever need!
              </h2>
              <p>
                Say goodbye to the stress of planning and hello
                to personalized recommendations, efficient
                itineraries, and seamless dining experiences.
              </p>
            </div>

            <div className="cardVideo">
              <video src={video} autoPlay loop muted type="video/mp4"></video>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default About