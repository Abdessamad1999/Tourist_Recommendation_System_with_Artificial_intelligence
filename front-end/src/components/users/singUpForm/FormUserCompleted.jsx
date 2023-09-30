import React from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './singup.css';

function FormUserCompleted() {
  const user = useSelector(state => state.auth.user)
  console.log(user)
  return (
    <div className='success'>
      <div className="header-success">
        <BsCheckLg className='icon' />
        <p>Success!</p>
      </div>
      <div className='body-success'>
        <p>Welcom {user && ((user.first_name)+' '+(user.last_name))} in <span>RiHLA</span></p>
        <Link className='btn btn-ok' to="/">OK</Link>
      </div>
    </div>
  )
}


export default FormUserCompleted;