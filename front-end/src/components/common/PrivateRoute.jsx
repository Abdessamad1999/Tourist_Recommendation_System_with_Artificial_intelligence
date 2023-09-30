import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ auth, children}) => {
    if (auth.isLoading) {
        return <h2>Loading...</h2>
    } else if (!auth.isAuthenticated) {
        return <Navigate to='/login' />
    } else {
        return <>{children}</>
    }
}




const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute);
