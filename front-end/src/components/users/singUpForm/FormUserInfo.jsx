import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formStage, formInfo, register } from '../../../actions/auth';
import './singup.css';

function FormUserInfo() {

  // redux
  const dispatch = useDispatch();

  // get Redux store values for formUserSingup
  const currentStage = useSelector(state => state.auth.formStage);
  const user_data = useSelector(state => state.auth.formUserSingup);

  const [data, setData] = useState([])

  const onClick = (e) => {
    const value = e.target.value;
    const index = data.indexOf(value)
    let category = document.querySelector(`button[value='${value}']`);
    if (index === -1) {
      setData([
        ...data,
        value
      ]);

      category.className = 'category active'

    } else {
      data.splice(index, 1)
      category.className = 'category'
    }
  }

  const [isSubmitted, setIsSubmitted] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  }

  useEffect(() => {
    if (isSubmitted) { 
      dispatch(formStage(3));
      dispatch(formInfo(data));
      dispatch(register(user_data, data));
    }

  }, [isSubmitted, dispatch, data])

  return (
    <>
      <form onSubmit={onSubmit} className="px-md-2">
        <div className="categories">
          <button type='button' className="category" value='Landmarks & Historical Buildings' onClick={onClick}>
          Landmarks & Historical Buildings
          </button>

          <button type='button' className="category" value='Party & Event Planning' onClick={onClick}>
            Music
          </button>

          <button type='button' className="category" value='Arts & Entertainment' onClick={onClick}>
          Arts & Entertainment
          </button>

          <button type='button' className="category" value='Hotels' onClick={onClick}>
          Hotels
          </button>

          <button type='button' className="category" value='Restaurants' onClick={onClick}>
          Restaurants
          </button>

          <button type='button' className="category" value='Tours' onClick={onClick}>
          Tours
          </button>

          <button type='button' className="category" value='Museums' onClick={onClick}>
          Museums
          </button>

          <button type='button' className="category" value='Festivals' onClick={onClick}>
          Festivals
          </button>

          <button type='button' className="category" value='Cultural Center' onClick={onClick}>
          Culture
          </button>

        </div>
        <div className="d-flex justify-content-end footer-singup my-2">
          <button type="button" className='btn btn-back' onClick={() => dispatch(formStage(currentStage-1))}>Back</button>
          <button type="submit" className='btn btn-custom'>Register</button>
        </div>
      </form>
    </>
  )
}

export default FormUserInfo;