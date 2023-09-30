import React from 'react';
import '../../dashboard.css';
import DataTableReviews from './DataTableReviews';

function ReviewsDash() {
  return (
    <div className="content-dashboard">
      {/* page hiding */}
      <div className="d-sm-flex align-items-center justify-content-between heading-dashboard">
        <div className='d-flex'>
          <h1 className="path">Dashboard</h1>
          <span>/</span>
          <h1 className="path">Reviews</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow mbottom-4 p-0">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary-cust">Table of reviews</h6>
            </div>
            <div className="card-body">
              <DataTableReviews />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewsDash