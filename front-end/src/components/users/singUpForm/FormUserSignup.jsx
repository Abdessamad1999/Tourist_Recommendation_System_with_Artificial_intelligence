import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formStage, formSingup } from '../../../actions/auth';
import avatar from '../../../images/avatar.png';
import './singup.css';
import axios from 'axios';

function FormUserSignup() {

  // redux
  const dispatch = useDispatch();

  // get Redux store values for formUserSingup
  const currentStage = useSelector(state => state.auth.formStage);
  const image = useSelector(state => state.auth.formUserSingup.image);
  const firstName = useSelector(state => state.auth.formUserSingup.first_name);
  const lastName = useSelector(state => state.auth.formUserSingup.last_name);
  const gender = useSelector(state => state.auth.formUserSingup.gender);
  const dateBirth = useSelector(state => state.auth.formUserSingup.date_birth);
  const city = useSelector(state => state.auth.formUserSingup.city);
  const country = useSelector(state => state.auth.formUserSingup.country);
  const familiarSituation = useSelector(state => state.auth.formUserSingup.familiar_situation);
  const email = useSelector(state => state.auth.formUserSingup.email);
  const password = useSelector(state => state.auth.formUserSingup.password);
  const confirmePassword = useSelector(state => state.auth.formUserSingup.confirme_password);

  const [formData, setFormData] = useState({
    image: image || "",
    first_name: firstName || "",
    last_name: lastName || "",
    gender: gender || "",
    date_birth: dateBirth || "",
    city: city || "",
    country: country || "",
    familiar_situation: familiarSituation || "",
    email: email || "",
    password: password || "",
    confirme_password: confirmePassword || "",
  })

  const imageUploader = useRef(null);

  const handleImageUpload = e => {
    const { name, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0]
      })
    }

  };

  const getUrl = (image) => {
    if (image) {
      return URL.createObjectURL(image);
    }
    return avatar;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const [errors, setErrors] = useState({})
  const validate = (formData) => {
    let formErrors = {}

    // first name
    if (!formData.first_name) {
      formErrors.first_name = 'First name required';
    }

    // last name
    if (!formData.last_name) {
      formErrors.last_name = 'Last name required';
    }

    // gender
    if (!formData.gender) {
      formErrors.gender = 'Gender required';
    }

    // birthday
    if (!formData.date_birth) {
      formErrors.date_birth = 'Birthday required';
    }

    // city
    if (!formData.city) {
      formErrors.city = 'City required';
    }

    // country
    if (!formData.country) {
      formErrors.country = 'Country required';
    }

    // situation faminiar
    if (!formData.familiar_situation) {
      formErrors.familiar_situation = 'Situation familiar required';
    }

    // email
    const emailRegex = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if (!formData.email || !emailRegex.test(formData.email)) {
      formErrors.email = 'Valid Email required';
    }

    // password
    const passwordRegex = new RegExp('(?=.*[a-z])+(?=.*[A-Z])+(?=.*[0-9])+(?=.{10,})')
    if (!formData.password || !passwordRegex.test(formData.password)) {
      formErrors.password = 'The minimum password length is 10 characters and must contain at least 1 lowercase letter, 1 uppercase letter and 1 number)';
      //console.log(formData.password.length)
    }

    // confirme password
    if (formData.password != formData.confirme_password) {
      formErrors.confirme_password = 'Password not match';
    }

    return formErrors;
  }

  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setErrors(validate(formData));
    setIsSubmitted(true);
  }

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitted) {
      dispatch(formStage(2));

      dispatch(formSingup(formData));

    }
  }, [formData, isSubmitted, dispatch, errors])

  const [data, setData] = useState([]);
  const [citys, setCitys] = useState([]);

  useEffect(()=>{
    axios.get('https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json')
    .then(res => setData(res.data))
    .catch(err => console.log(err))
  }, [])

  const countrys = [...new Set(data.map(item => item.country))];
  countrys.sort();

  const handelCountry = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    let citys = data.filter(city => city.country === value);
    citys = [...new Set(citys.map(item => item.name))]
    citys.sort();
    setCitys(citys);
  }

  return (
    <>
      <form onSubmit={(e) => onSubmit(e)} className="px-md-2">
        <div class="row">
          <div class="col-12 mb-4">
            <div className="avatar d-flex flex-column justify-content-center align-items-center">
              <input type="file" name='image' className='d-none' accept='image/*' 
              onChange={handleImageUpload} ref={imageUploader} />
              <div className="input-avatar" onClick={() => imageUploader.current.click()}>
                <img src={getUrl(formData.image)} className='avatar-img' />
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="custom-control">
              <input type="text" class="form-control" placeholder=''
                id="FirstName" name='first_name'
                value={formData.first_name} onChange={onChange} />
              <label htmlFor="FirstName" class="form-label">First Name</label>
            </div>
            <p className='errors'>
              {errors.first_name}
            </p>
          </div>
          <div class="col-md-6 mb-4">
            <div class="custom-control">
              <input type="text" class="form-control" placeholder=''
                id="LasttName" name='last_name'
                value={formData.last_name} onChange={onChange} />
              <label htmlFor="LasttName" class="form-label">Last Name</label>
            </div>
            <p className='errors'>
              {errors.last_name}
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-4">
            <div className='custom-control'>
              <div className="custom-select">
                <select id='Gender' name='gender'
                  class="select form-select"
                  value={formData.gender} onChange={onChange}>
                  <option value=''>--Select your gender--</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
            </div>
            <p className='errors'>
              {errors.gender}
            </p>
          </div>
          <div class="col-md-6 mb-4">
            <div class="custom-control">
              <input type="date" class="form-control"
                id="DateBirth" name='date_birth'
                value={formData.date_birth} onChange={onChange} />
            </div>
            <p className='errors'>
              {errors.date_birth}
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="custom-control">
              <div className="custom-select">
                <select id='Country' name='country'
                  class="select form-select"
                  value={formData.country} onChange={handelCountry}>
                  <option value=''>--Select your country--</option>
                  {countrys.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className='errors'>
              {errors.country}
            </p>
          </div>
          <div class="col-md-6 mb-4">
            <div class="custom-control">
              <div className="cutom-select">
                <select id='City' name='city'
                  class="select form-select"
                  value={formData.city} onChange={onChange}>
                  <option value=''>--Select your city--</option>
                  {citys.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className='errors'>
              {errors.city}
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="custom-control">
              <input type="email" class="form-control" placeholder=''
                id="Email" name='email'
                value={formData.email} onChange={onChange} />
              <label htmlFor="Email" class="form-label">Email</label>
            </div>
            <p className='errors'>
              {errors.email}
            </p>
          </div>
          
          <div class="col-md-6 mb-4">
            <div class="custom-control">
              <div className="cutom-select">
                <select id='FamiliarSituation' name='familiar_situation'
                  class="select form-select"
                  value={formData.familiar_situation} onChange={onChange}>
                  <option value='' selected>Select your familiar situation</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </div>
            </div>
            <p className='errors'>
              {errors.familiar_situation}
            </p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="custom-control">
              <input type="password" class="form-control" placeholder=''
                id="Password" name='password'
                value={formData.password} onChange={onChange} />
              <label htmlFor="Password" class="form-label">Password</label>
            </div>
            <p className='errors'>
              {errors.password}
            </p>
          </div>
          <div class="col-md-6 mb-4">
            <div class="custom-control">
              <input type="password" class="form-control" placeholder=''
                id="ConfirmePassword" name='confirme_password'
                value={formData.confirme_password} onChange={onChange} />
              <label htmlFor="ConfirmePassword" class="form-label">Confirme password</label>
            </div>
            <p className='errors'>
              {errors.confirme_password}
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-end footer-singup">
          <button type="submit" className='btn btn-custom mb-3'>Next</button>
        </div>
      </form>
    </>
  )
}

export default FormUserSignup;