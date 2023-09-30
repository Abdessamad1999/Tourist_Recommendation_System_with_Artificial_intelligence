import './App.css'
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import store from './store';
import Navbar from './components/navbar/Navbar';
import Login from './components/users/Login';
import Singup from './components/users/Singup';
import PrivateRoute from './components/common/PrivateRoute';
import { loadUser } from './actions/auth'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Blogs from './pages/blogs/Blogs';
import Article from './pages/blogs/Article';
import Footer from './components/footer/Footer';
import NotFound from './pages/notFound/NotFound';
import Trips from './pages/tripPlanning/Trips';
import Profile from './components/users/profile/Profile';




class App extends React.Component {

  componentDidMount() {
    store.dispatch(loadUser());
  }
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/blog" element={<Blogs/>} />
            <Route path="/blog/:blogId" element={<Article />} />
            <Route path="/travel" element={
              <PrivateRoute>
                <Trips />
              </PrivateRoute>
            } />
            <Route path="/profile" element={<Profile/>}/>
            {/* <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } /> */}
            <Route path='/login' Component={Login} />
            <Route path='/register' Component={Singup} />
            <Route path='*' element={<NotFound/>} />
          </Routes>
          <Footer />
        </Router>
        <ToastContainer className="toast-position"
          position="top-center"></ToastContainer>
      </Provider>
    )
  }

}

export default App;
