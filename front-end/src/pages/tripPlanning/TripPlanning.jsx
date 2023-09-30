import React, { Component } from 'react';
import './tripplanning.css';
import { CgPrinter } from 'react-icons/cg';
import { AiOutlineEye } from 'react-icons/ai';

import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { createTrip } from '../../actions/trips';
import { getItems } from '../../actions/items';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export class TripPlanning extends Component {

  state = {
    debut: '',
    fin: '',
    number_items: 3
  };

  static propTypes = {
    trips: PropTypes.array.isRequired,
    items: PropTypes.array.isRequired,
    createTrip: PropTypes.func.isRequired,
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    const { debut, fin, number_items } = this.state;
    const info = { debut, fin, number_items };
    this.props.createTrip(info)
    this.setState({
      debut: '',
      fin: '',
      number_items: 3
    });
  }

  componentDidMount() {
    this.props.getItems();
  }


  render() {

    const { debut, fin, number_items } = this.state;

    return (
      <div>
        <section class="hero">
          <div class="container">

            <h2 class="h1 hero-title">Journey to explore world</h2>

            <p class="hero-text">
              Ac mi duis mollis. Sapiente? Scelerisque quae, penatibus? Suscipit class corporis nostra rem quos
              voluptatibus habitant?
              Fames, vivamus minim nemo enim, gravida lobortis quasi, eum.
            </p>

            <div class="hero-form">
              <form className="row g-3" onSubmit={this.onSubmit}>
                <div class="col-md-4">
                  <label for="in1" class="form-label">Text</label>
                  <select class="form-control" id='in1' name='debut' value={debut} onChange={this.onChange}>
                    <option value="default">enter your destination country</option>
                    {this.props.items && this.props.items.map((item, index) => (
                      <option value={item._id} key={index}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="in2" class="form-label">Text</label>
                  <select class="form-control" id='in2' name='fin' value={fin} onChange={this.onChange}>
                    <option value="default">enter your destination country</option>
                    {this.props.items && this.props.items.map((item, index) => (
                      <option value={item._id} key={index}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="in3" class="form-label">Text</label>
                  <input type="number" class="form-control" id="in3" min="3" name='number_items' value={number_items} onChange={this.onChange} />
                </div>
                <button type='submit' className='generate btn'>generate itinerary</button>
              </form>
            </div>

          </div>
        </section>

        <div id="wrapper" className='mt-4'>
          {this.props.trips && (
            <div id="content-wrapper" className="d-flex flex-column">
              <div id="content">
                <div className="container-fluid">
                  <div className="row">

                    {/* list items */}
                    <div className="order-2 order-xl-1 col-xl-4 col-lg-5 p-0">
                      <div className="card border-0 mb-4">
                        <div className="card-header">
                          <button type='button' href="/" className="btn btn-primary-cust mr-3">
                            Save itinerary
                          </button>

                          <button type='button' href="/" className="btn btn-secondary-cust">
                            <CgPrinter className='icon' />
                          </button>
                        </div>
                        <div className="card-body">
                          {this.props.trips.map((item, index) => (
                            <div key={index} className="card-item d-flex">
                              <div className="image-item">
                                <div className="number-item">0{index}</div>
                                <img src={item.images[0].image} alt={item.name} />
                              </div>
                              <div className="item-body">
                                <div className="header">
                                  <h3 className="title">{item.name}</h3>
                                  <p className="city">{item.city}, country</p>
                                </div>
                                <div className="rating">
                                  <Rating
                                    style={{ maxWidth: 80 }}
                                    value={item.stars}
                                    readOnly
                                  />
                                  <div className="reviews-numbers">
                                    <AiOutlineEye className='icon' />
                                    <p>{item.review_count}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Map */}
                    <div className="order-1 order-xl-2 col-xl-8 col-lg-7">
                      <div className="card shadow mb-4">
                        {/* body card */}
                        <MapContainer center={[29.9593636, -90.0714433]} zoom={14} >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />

                          {this.props.trips.map((item, index) => (
                            <Marker key={index} position={[item.Latitude, item.Longitude]}>
                              <Popup>
                                <div className="card-item d-flex">
                                  <div className="image-item">
                                    <div className="number-item">0{index}</div>
                                    <img src={item.images[0].image} alt={item.name} />
                                  </div>
                                  <div className="item-body">
                                    <div className="header">
                                      <h3 className="title">{item.name}</h3>
                                      <p className="city">{item.city}, country</p>
                                    </div>
                                    <div className="rating">
                                      <Rating
                                        style={{ maxWidth: 80 }}
                                        value={item.stars}
                                        readOnly
                                      />
                                      <div className="reviews-numbers">
                                        <AiOutlineEye className='icon' />
                                        <p>{item.review_count}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Popup>
                            </Marker>
                          ))}
                         
                        </MapContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  items: state.items.items,
  trips: state.trips.trips,
});



export default connect(mapStateToProps, { getItems, createTrip })(TripPlanning);