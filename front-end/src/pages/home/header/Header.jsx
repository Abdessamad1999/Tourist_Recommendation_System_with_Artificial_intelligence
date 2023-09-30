import { Link } from 'react-router-dom'
import './header.css'

function Header() {
    return (
        <section className="home">
            <div className="container">
                <div className="homeText">

                    <h1 className="title">
                        Plan Your Trip With RiHLA
                    </h1>

                    <p className="subTitle">
                        Travel to your favourite places with respectful of the environment!
                    </p>

                    <div className="btn">
                        <Link className='link' to="/blog">Explore now</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Header;