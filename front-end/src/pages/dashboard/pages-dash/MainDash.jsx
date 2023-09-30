import React, { useEffect } from 'react';
import '../dashboard.css';
import { FaUsers } from 'react-icons/fa6';
import { MdRateReview, MdPlace } from 'react-icons/md';
import { BiTrip, BiDotsVerticalRounded } from 'react-icons/bi';
import BarFig from '../charts/BarFig';
import PieFig from '../charts/PieFig';
import { useDispatch, useSelector } from 'react-redux';
import { getNumbersDash, getReviewsDistru } from '../../../actions/reviews';
import { likeDislike, getTripsDistru } from '../../../actions/trips';

function MainDash() {

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getNumbersDash());
    dispatch(getReviewsDistru());
    dispatch(getTripsDistru());
  },[])

  const dash_numbers = useSelector(state => state.reviews.dashboard_numbers);
  const reviews_distru = useSelector(state => state.reviews.reviews_distru);
  const trips_distru = useSelector(state => state.trips.trips_distru);

  return (
    
    <div className="content-dashboard">
      {/* page hiding */}
      <div className="d-sm-flex align-items-center justify-content-between heading-dashboard">
        <div className='d-flex'>
          <h1 className="path">Dashboard</h1>
        </div>
      </div>

      <div className="row">

        {/* card users */}
        <div className="col-xl-3 col-md-6 mbottom-4">
          <div className="card border-left-warning shadow paddingy-2 h-100">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col p-0 mr-2">
                  <div className="text-xs font-weight-bold text-primary-cust text-uppercase mb-1">
                    Number of users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray">{dash_numbers && dash_numbers.nb_users}</div>
                </div>
                <div className="col-auto p-0">
                  <FaUsers className='icon-card' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* card items */}
        <div className="col-xl-3 col-md-6 mbottom-4">
          <div className="card border-left-success shadow paddingy-2 h-100">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col p-0 mr-2">
                  <div className="text-xs font-weight-bold text-primary-cust text-uppercase mb-1">
                    Number of places
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray">{dash_numbers && dash_numbers.nb_items}</div>
                </div>
                <div className="col-auto p-0">
                  <MdPlace className='icon-card' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* card reviews */}
        <div className="col-xl-3 col-md-6 mbottom-4">
          <div className="card border-left-info shadow paddingy-2 h-100">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col p-0 mr-2">
                  <div className="text-xs font-weight-bold text-primary-cust text-uppercase mb-1">
                    Number of ratings
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray">{dash_numbers && dash_numbers.nb_reviews}</div>
                </div>
                <div className="col-auto p-0">
                  <MdRateReview className='icon-card' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* card trips */}
        <div className="col-xl-3 col-md-6 mbottom-4">
          <div className="card border-left-primary shadow paddingy-2 h-100">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col p-0 mr-2">
                  <div className="text-xs font-weight-bold text-primary-cust text-uppercase mb-1">
                    Number of trips
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray">{dash_numbers && dash_numbers.nb_trips}</div>
                </div>
                <div className="col-auto p-0">
                  <BiTrip className='icon-card' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">

        {/* Chart */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mbottom-4 p-0">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary-cust">Rating distributions</h6>
            </div>

            <div className="card-body">
              <div className="chart-area">
                {reviews_distru && <BarFig data={reviews_distru}/>}
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mbottom-4 p-0">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary-cust">trip planning service</h6>
            </div>

            <div className="card-body">
              <div className="chart-area">
                {trips_distru && <PieFig data={trips_distru}/>}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MainDash