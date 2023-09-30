import React, { useEffect, useRef, useState } from 'react';
import './profile.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../../images/profile.png';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getKeyWordUser, update } from '../../../actions/auth';
import { getCategoriesUser, getNumberReviewsAndTrips } from '../../../actions/reviews';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
            position: 'top',
        },
        title: {
            display: false,
            text: 'Chart.js Bar Chart',
        },
    },
};

function Profile() {

    const dispatch = useDispatch();


    const user = useSelector(state => state.auth.user);
    const listKeyWord = useSelector(state => state.auth.keyWords);
    const categories_user = useSelector(state => state.reviews.categories_user);
    const number_reviews_trips = useSelector(state => state.reviews.reviews_trips_number);

    const [formData, setFormData] = useState({

        image: (user && user.image) ? user.image : "",
        first_name: (user && user.first_name) ? user.first_name : "",
        last_name: (user && user.last_name) ? user.last_name : "",
        gender: (user && user.gender) ? user.gender : "",
        city: (user && user.city) ? user.city : "",
        country: (user && user.country) ? user.country : "",
        familiar_situation: (user && user.familiar_situation) ? user.familiar_situation : ""
    })

    useEffect(() => {
        dispatch(getKeyWordUser());
        dispatch(getCategoriesUser());
        dispatch(getNumberReviewsAndTrips());
    }, [])

    useEffect(()=>{
        setFormData({
            image: (user && user.image) ? user.image : "",
            first_name: (user && user.first_name) ? user.first_name : "",
            last_name: (user && user.last_name) ? user.last_name : "",
            gender: (user && user.gender) ? user.gender : "",
            city: (user && user.city) ? user.city : "",
            country: (user && user.country) ? user.country : "",
            familiar_situation: (user && user.familiar_situation) ? user.familiar_situation : ""
        });

        let citys = data.filter(city => city.country === formData.country);
        citys = [...new Set(citys.map(item => item.name))]
        citys.sort();
        setCitys(citys);
    }, [user])

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
        if (typeof image !== 'string') {
            return URL.createObjectURL(image);
        }
        return image;
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
            dispatch(update(formData));
        }
    }, [formData, isSubmitted, dispatch, errors])

    const [data, setData] = useState([]);
    const [citys, setCitys] = useState([]);

    useEffect(() => {
        axios.get('https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json')
            .then(res => {
                setData(res.data);
            })
            .catch(err => console.log(err))
    }, [])

    const countrys = data ? [...new Set(data.map(item => item.country))] : [];
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
            <div className="main row py-5 px-4">
                <div className="card col-lg-9 mx-auto">
                    {/* <!-- Profile widget --> */}

                    <div className="px-4 pt-0 profile">
                        <div className="profile-img">
                            <img src={(user && user.image) || avatar} alt="..."
                                className="rounded mb-2 image" />
                            <button type="button" className="btn w-100 btn-outline-dark btn-sm btn-block" data-bs-toggle="modal" data-bs-target="#editModal">
                                Edit profile
                            </button>
                        </div>
                        <div className="profile-body">
                            <h4 className="name">{(user && ((user.first_name) + ' ' + (user.last_name))) || "Prenom Nom"}</h4>
                            <p className="adress">
                                <FaMapMarkerAlt className='icon' />  {(user && user.city) || "City"}
                            </p>
                        </div>
                    </div>

                    <div className="bg-light p-4 d-flex justify-content-end text-center">
                        <ul className="list-inline mb-0">
                            <li className="list-inline-item">
                                <h5 className="font-weight-bold mb-0 d-block">{number_reviews_trips && number_reviews_trips.reviews}</h5>
                                <small className="text-muted">Reviews</small>
                            </li>
                            <li className="list-inline-item">
                                <h5 className="font-weight-bold mb-0 d-block">{number_reviews_trips && number_reviews_trips.trips}</h5>
                                <small className="text-muted">Trips</small>
                            </li>
                        </ul>
                    </div>

                    <div className="py-3">
                        <h5 className="mb-1">Bio Graph</h5>
                        <div className="p-4 rounded shadow-sm bg-light bio-graph">
                            <div className="bio-info">
                                <p><span>First Name</span>: {(user && user.first_name) || "Prenom"}</p>
                            </div>
                            <div className="bio-info">
                                <p><span>Last Name</span>: {(user && user.last_name) || "Nom"}</p>
                            </div>
                            <div className="bio-info">
                                <p><span>Gender</span>: {(user && user.gender) || "Male"}</p>
                            </div>
                            <div className="bio-info">
                                <p><span>Birthday</span>: {(user && user.date_birth) || "11 Jul 1989"}</p>
                            </div>
                            <div className="bio-info">
                                <p><span>Situiation familiere</span>: {(user && user.familiar_situation) || "Single"}</p>
                            </div>
                            <div className="bio-info">
                                <p><span>E-mail</span>: {(user && user.email) || "user@email.com"}</p>
                            </div>
                            <div className="bio-info">
                                <p><span>Country</span>: {(user && user.country) || "Moroco"}</p>
                            </div>
                            <div className="bio-info">
                                <p><span>City</span>: {(user && user.city) || "Meknès"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="py-3">
                        <h5 className="mb-1">Key Words</h5>
                        <div className="p-4 rounded shadow-sm bg-light">
                            <div className="key-words">
                                {listKeyWord && listKeyWord.map((word, index) => (
                                    <div key={index} className="key-word">
                                        {word}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="py-3">
                        <h5 className="mb-1">Favorite categories</h5>
                        <div className="p-4 rounded shadow-sm bg-light">
                            {categories_user && (<Bar options={options} data={generData(categories_user)} />)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editModalLabel">Edit profile</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={(e) => onSubmit(e)}>
                            <div className="modal-body p-3 p-md-5 pb-md-0 pb-0">


                                <div class="row">
                                    <div class="col-12 mb-4">
                                        <div className="avatar d-flex flex-column justify-content-center align-items-center">
                                            <input type="file" name='image' className='d-none' accept='image/*'
                                                onChange={handleImageUpload} ref={imageUploader} />
                                            <div className="input-avatar" onClick={() => imageUploader.current.click()}>
                                                <img src={getUrl(formData.image)} alt='avatar' className='avatar-img' />
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
                                            <div className="custom-select">
                                                <select id='Country' name='country'
                                                    class="select form-select"
                                                    value={formData.country} onChange={handelCountry}>
                                                    <option value=''>--Select your country--</option>
                                                    {countrys && countrys.map(country => (
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
                                                    {citys && citys.map(city => (
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


                            </div>
                            <div className="modal-footer footer-singup">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-custom" data-bs-dismiss="modal">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

const generData = (categories_user) => {
    const labels = categories_user.labels;
    const values = categories_user.values;

    const data = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    }

    return data;
}

export default Profile