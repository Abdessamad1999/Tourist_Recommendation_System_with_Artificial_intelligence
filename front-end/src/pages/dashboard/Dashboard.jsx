import React from 'react';
import './dashboard.css';
import Sidebar from './sidebar/Sidebar';
import MainDash from './pages-dash/MainDash';
import ItemsDash from './pages-dash/page-item/ItemsDash';
import ReviewsDash from './pages-dash/page-review/ReviewsDash';
import avatar from '../../images/avatar.png';
import { useLocation } from 'react-router-dom';
import UsersDash from './pages-dash/page-users/UsersDash';
import { useSelector } from 'react-redux';

function Dashboard() {

  const location = useLocation()

  const user = useSelector(state => state.auth.user);

  return (

    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-main">
        {/* navbar */}
        <div className="top-dashboard">
          <div className='name'>{user && `${user.first_name} ${user.last_name}`}</div>
          <div className='avatar'>
            <img className='rounded-circle' src={user && user.image} alt={user && `${user.first_name} ${user.last_name}`} />
          </div>
        </div>
        {location.pathname === "/dashboard" ? (<MainDash />) : <></>}
        {location.pathname === "/dashboard/items" ? (<ItemsDash/>) : <></>}
        {location.pathname === "/dashboard/users" ? (<UsersDash/>) : <></>}
        {location.pathname === "/dashboard/reviews" ? (<ReviewsDash/>) : <></>}
      </div>
    </div>
  )
}

export default Dashboard