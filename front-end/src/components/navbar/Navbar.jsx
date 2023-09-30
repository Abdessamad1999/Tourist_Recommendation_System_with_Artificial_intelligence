import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import logo from '../../images/logo.png'
import { RiMenu3Fill } from 'react-icons/ri'
import { BiTrip, BiLogOut, BiSolidUser, BiSolidDashboard } from 'react-icons/bi'
import { connect } from 'react-redux';
import { logout } from '../../actions/auth'

import './navbar.css'

function Navbar(props) {
    const location = useLocation();
    const navigate = useNavigate();

    //code to add bg color to the header
    const [transparent, setTransparent] = useState('navbar navbar-expand-lg navbar-light')
    const addBg = () => {
        if (window.scrollY >= 10) {
            setTransparent('navbar navbar-expand-lg navbar-light activeNavbar')
        } else {
            setTransparent('navbar navbar-expand-lg navbar-light')
        }
    }

    if (location.pathname === "/" || location.pathname.includes("/blog" ) || location.pathname === "/travel" || location.pathname === "/profile") {
        window.addEventListener('scroll', addBg)

        return (
            <nav className={transparent}>
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img className='logo' src={logo} alt='RiHLA web Site' />
                    </Link>
                    <span className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <RiMenu3Fill className='icon' />
                    </span>

                    <div className=" collapse navbar-collapse " id="navbarNavDropdown">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link mx-2" to="/" >
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link mx-2" to="/blog">Blogs</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link mx-2" to="/travel">Trip Planning</NavLink>
                            </li>
                        </ul>

                        {props.auth && props.auth.isAuthenticated ? (
                            <div className="navprofile ms-auto dropdown no-arrow">
                                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="mx-2 d-lg-inline text-gray-600 small text-white">{props.auth.user.first_name} {props.auth.user.last_name}</span>
                                    <img className="img-profile rounded-circle"
                                        src={props.auth.user.image} />
                                </a>

                                <div className="dropdown-menu shadow animated-grow-in"
                                    aria-labelledby="userDropdown">

                                    {props.auth.user && props.auth.user.is_staff && (
                                        <Link className="dropdown-item" to="/dashboard">
                                            <BiSolidDashboard className='icon' />
                                            Dashboard
                                        </Link>
                                    )}

                                    <Link className="dropdown-item" to="/profile">
                                        <BiSolidUser className='icon' />
                                        Profile
                                    </Link>
                                    <Link className="dropdown-item" to="/travel#my_trips">
                                        <BiTrip className='icon' />
                                        My Trips
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <button type='button' className="btn dropdown-item" onClick={() => {props.logout();  navigate('/')}}>
                                        <BiLogOut className='icon' />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="navBtns ms-auto">
                                <button className="btn loginBtn">
                                    <a className='link' href='/login'>Login</a>
                                </button>

                                <button className="btn">
                                    <a className='link' href='/register'>Sign Up</a>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        )
    } else {
        <></>
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})

const mapDispatchToProps = {
    logout: logout,
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
