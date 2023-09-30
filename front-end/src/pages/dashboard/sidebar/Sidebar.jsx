import React, { useState } from 'react';
import './sidebar.css';
import logoSidebar from '../../../images/logo-R.png';
import { sidebarItems } from '../../../data';
import SidebarItem from './SidebarItem';
import { BiSolidLeftArrowSquare } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [inactive, setInactive] = useState(false);

    return (
        <div className={`sidebar ${inactive ? 'inactive' : ''}`}>
            <div className="header-sidebar">

                <div className='sidebar-logo'>
                    <Link to='/' >
                        <div className='logo'>
                            <img src={logoSidebar} alt="RiHLA" />
                        </div>
                    </Link>
                    <h2 className="title">RiHLA</h2>
                </div>

                <button className='toggle-sidebar-btn' onClick={() => setInactive(!inactive)}>
                    <BiSolidLeftArrowSquare className='icon' />
                </button>
            </div>

            <div className="main-sidebar">
                {sidebarItems && sidebarItems.map((item, index) => (
                    <>
                        <SidebarItem key={index} item={item} />
                        <hr className="sidebar-divider" />
                    </>
                ))}
            </div>


        </div>
    )
}

export default Sidebar