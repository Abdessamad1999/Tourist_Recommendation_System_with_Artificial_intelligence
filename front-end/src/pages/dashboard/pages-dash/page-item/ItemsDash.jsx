import React, { useEffect, useState } from 'react';
import '../../dashboard.css';
import DataTableItems from './DataTableItems';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { categoriesItem } from '../../../../data';
import { addItem } from '../../../../actions/items';
import Select from 'react-select';

function ItemsDash() {

  const dispatch = useDispatch();

  categoriesItem.sort();

  const option = () => {
    let optionData = []
    for (const category of categoriesItem) {
      optionData.push({ value: category, label: category })
    }
    return optionData
  }

  const optionList = option()


  const [citys, setCitys] = useState([]);
  const typeItem = ["Museum", "Fortress", "Sites Naturels", "Artificial sites", "Music", "Festival"];

  useEffect(() => {
    axios.get('https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json')
      .then(res => {
        let citys = res.data.filter(city => city.country === "Morocco");
        citys = [...new Set(citys.map(item => item.name))]
        citys.sort();
        setCitys(citys);
      })
      .catch(err => console.log(err))
  }, [dispatch])

  const [formData, setFormData] = useState({})

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSelect = (data) => {
    setFormData({
      ...formData,
      ['categories']: data
    });
  }

  const handleImages = e => {
    const { name, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files
      })
    }
  };

  const [isSubmit, setIsSubmit] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault();
    if(formData.categories){
      let values = []
      for (let i = 0; i < formData.categories.length; i++) {
        values.push(formData.categories[i].value)
      }
      setFormData({
        ...formData,
        ['categories']: values
      });
    }
    setErrors(validate(formData));
    setIsSubmit(true)
  }

  const [errors, setErrors] = useState({})
  const validate = (formData) => {
    let formErrors = {}

    if (!formData.name) {
      formErrors.name = 'Name of item required';
    }

    if (!formData.adress) {
      formErrors.adress = 'Adress of item required';
    }

    if (!formData.category) {
      formErrors.category = 'Category of item required';
    }

    if (!formData.categories) {
      formErrors.categories = 'Categories of item required';
    }

    if (!formData.description) {
      formErrors.description = 'Description of item required';
    }

    if (!formData.Latitude) {
      formErrors.Latitude = 'Latitude of item required';
    }

    if (!formData.Longitude) {
      formErrors.Longitude = 'Longitude of item required';
    }

    if (!formData.city) {
      formErrors.city = 'City of item required';
    }

    if (!formData.images) {
      formErrors.images = 'Images of item required';
    }

    return formErrors;
  }

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmit) {
      dispatch(addItem(formData));
      setIsSubmit(false);
      setFormData({});
    }
  }, [formData, dispatch, isSubmit, errors])

  return (
    <div className="content-dashboard">

      {/* page hiding */}
      <div className="d-sm-flex align-items-center justify-content-between heading-dashboard">
        <div className='d-flex'>
          <h1 className="path">Dashboard</h1>
          <span>/</span>
          <h1 className="path">Items</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow mbottom-4 p-0">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary-cust">Table</h6>
              <button type='button' className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#addItemModal">Add item</button>
            </div>
            <div className="card-body">
              <DataTableItems />
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="addItemModal" tabindex="-1" aria-labelledby="addItemModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addItemModalLabel">Add Item</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={(e) => onSubmit(e)}>
              <div className="modal-body p-3 p-md-5 pb-md-0 pb-0">

                <div class="row">
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <input type="text" class="form-control" placeholder=''
                        id="name" name='name'
                        value={formData.name} onChange={onChange} />
                      <label htmlFor="name" class="form-label">Name</label>
                    </div>
                    <p className='errors'>
                      {errors.name}
                    </p>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <input type="text" class="form-control" placeholder=''
                        id="adress" name='adress'
                        value={formData.adress} onChange={onChange} />
                      <label htmlFor="adress" class="form-label">Adress</label>
                    </div>
                    <p className='errors'>
                      {errors.adress}
                    </p>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <div className="custom-select">
                        <select id='category' name='category'
                          class="select form-select"
                          value={formData.category} onChange={onChange}>
                          <option value=''>--Select type of item--</option>
                          {typeItem && typeItem.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <p className='errors'>
                      {errors.category}
                    </p>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <div className="cutom-select">
                        <select id='City' name='city'
                          class="select form-select"
                          value={formData.city} onChange={onChange}>
                          <option value=''>--Select city of item--</option>
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

                <div class="row">
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <input type="number" class="form-control" placeholder=''
                        id="Latitude" name='Latitude'
                        value={formData.Latitude} onChange={onChange} />
                      <label htmlFor="Latitude" class="form-label">Latitude</label>
                    </div>
                    <p className='errors'>
                      {errors.Latitude}
                    </p>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <input type="number" class="form-control" placeholder=''
                        id="Longitude" name='Longitude'
                        value={formData.Longitude} onChange={onChange} />
                      <label htmlFor="Longitude" class="form-label">Longitude</label>
                    </div>
                    <p className='errors'>
                      {errors.Longitude}
                    </p>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <input type="text" class="form-control" placeholder=''
                        id="timetable" name='timetable'
                        value={formData.timetable} onChange={onChange} />
                      <label htmlFor="timetable" class="form-label">Time table</label>
                    </div>
                    <p className='errors'>
                      {errors.timetable}
                    </p>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <input type="number" min={0} class="form-control" placeholder=''
                        id="price" name='price'
                        value={formData.price} onChange={onChange} />
                      <label htmlFor="price" class="form-label">Price (DH)</label>
                    </div>
                    <p className='errors'>
                      {errors.price}
                    </p>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <input type="email" class="form-control" placeholder=''
                        id="email" name='email'
                        value={formData.email} onChange={onChange} />
                      <label htmlFor="email" class="form-label">E-mail</label>
                    </div>
                    <p className='errors'>
                      {errors.email}
                    </p>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <input type="text" class="form-control" placeholder=''
                        id="phoneNumber" name='phoneNumber'
                        value={formData.phoneNumber} onChange={onChange} />
                      <label htmlFor="phoneNumber" class="form-label">Phone number</label>
                    </div>
                    <p className='errors'>
                      {errors.phoneNumber}
                    </p>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <input type="url" class="form-control" placeholder=''
                        id="site" name='site'
                        value={formData.site} onChange={onChange} />
                      <label htmlFor="site" class="form-label">Site</label>
                    </div>
                    <p className='errors'>
                      {errors.site}
                    </p>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <input type="url" class="form-control" placeholder=''
                        id="video" name='video'
                        value={formData.video} onChange={onChange} />
                      <label htmlFor="video" class="form-label">Video</label>
                    </div>
                    <p className='errors'>
                      {errors.video}
                    </p>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <input type="file" class="form-control" placeholder=''
                        id="images" name='images' multiple onChange={handleImages} />
                      <label htmlFor="images" class="form-label">Images</label>
                    </div>
                    <p className='errors'>
                      {errors.images}
                    </p>
                  </div>
                  <div class="col-md-6 mb-4">
                    <div class="custom-control">
                      <Select
                        options={optionList}
                        placeholder="--Select categories of item--"
                        value={formData.categories}
                        onChange={handleSelect}
                        isSearchable={true}
                        isMulti
                      />
                    </div>
                    <p className='errors'>
                      {errors.categories}
                    </p>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12 mb-4">
                    <div class="custom-control">
                      <textarea rows="4" class="form-control"
                        id="description" name='description'
                        value={formData.description} onChange={onChange}>
                      </textarea>
                      <label htmlFor="description" class="form-label">Description</label>
                    </div>
                    <p className='errors'>
                      {errors.description}
                    </p>
                  </div>
                </div>

              </div>
              <div className="modal-footer footer-singup">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-custom">Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemsDash