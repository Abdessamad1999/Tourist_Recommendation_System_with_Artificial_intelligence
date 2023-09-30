import './footer.css'
import { AiFillInstagram } from 'react-icons/ai'
import { BsTwitter } from 'react-icons/bs'
import { ImFacebook } from 'react-icons/im'
import logo from '../../images/logo.png'

import { Link, useLocation } from 'react-router-dom'

const Footer = () => {

    const location = useLocation();
    if (location.pathname === "/" || location.pathname === "/blog" || location.pathname === "/travel" || location.pathname === "/profile") {
        return (
            <div className="footer">
                <div className="secContainer container d-grid">
                    <div className="logoDiv">
                        <Link to="/">
                            <img src={logo} alt='Smart Travel' className="logo" />
                        </Link>

                        <div className="socials d-flex">
                            <ImFacebook className="icon" />
                            <BsTwitter className="icon" />
                            <AiFillInstagram className="icon" />
                        </div>

                    </div>

                    <div className="footerLinks">
                        <span className="linkTitle">
                            Information
                        </span>
                        <ul>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>
                                <a href="/travel">Explore</a>
                            </li>
                            <li>
                                <a href="/travel">Travel</a>
                            </li>
                            <li>
                                <a href="/blog">Blogs</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footerLinks">
                        <span className="linkTitle">
                            Helpful Links
                        </span>
                        <ul>
                            <li>
                                <a href="/blog">Destination</a>
                            </li>
                            <li>
                                <a href="/">Support</a>
                            </li>
                            <li>
                                <a href="/">Travel & Conditions</a>
                            </li>
                            <li>
                                <a href="/">Privacy</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footerLinks">
                        <span className="linkTitle">
                            Contact Us
                        </span>
                        <span className="phone">+212 612 3456</span>
                        <span className="email">contact-support@gmail.com</span>
                    </div>

                </div>
            </div>
        )
    } else {
        <></>
    }
}

export default Footer;