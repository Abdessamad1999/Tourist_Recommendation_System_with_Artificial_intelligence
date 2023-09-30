import React, { Component } from 'react';
import './tripplanning.css';
import { AiOutlineEye, AiOutlinePlus, AiOutlineClose, AiOutlineAppstoreAdd } from 'react-icons/ai';

import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { createTrip, resetIdTrip, saveTrip, updateTrip, addItemToTripManual, addItemToTripAuto, removeItemFromTrip } from '../../actions/trips';
import { getListItems } from '../../actions/items';
import { getRoute } from '../../actions/coords';

import MapTrips from './MapTrips';
import DataTableBase from './DataTableBase';
import { Link } from 'react-router-dom';

export class Trips extends Component {

    state = {
        debut: '',
        fin: '',
        number_items: 3,
        name: '',
        add_item: '',
        cas: 1,
        id_item: '',
    };

    static propTypes = {
        trips: PropTypes.array.isRequired,
        items: PropTypes.array.isRequired,
        coords: PropTypes.array.isRequired,
        id_trip: PropTypes.string.isRequired,
        createTrip: PropTypes.func.isRequired,
        saveTrip: PropTypes.func.isRequired,
        resetIdTrip: PropTypes.func.isRequired,
        updateTrip: PropTypes.func.isRequired,
        addItemToTripAuto: PropTypes.func.isRequired,
        addItemToTripManual: PropTypes.func.isRequired,
        removeItemFromTrip: PropTypes.func.isRequired,
        getRoute: PropTypes.func.isRequired,
        getListItems: PropTypes.func.isRequired,
    }

    filter_item = (item) => {
        for (const e of this.props.trips) {
            if (item._id === e._id) {
                return false
            }
        }
        return true
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    onChange_item = (id_item) => this.setState({ ['id_item']: id_item, ['cas']: -1 });

    onSubmit = (e) => {
        e.preventDefault();
        const { debut, fin, number_items } = this.state;
        const info = { debut, fin, number_items };
        this.props.createTrip(info)
        this.setState({
            debut: '',
            fin: '',
            number_items: 3,
        });
        this.props.resetIdTrip();
    }

    save_trip = (e) => {
        let items = []
        for (let i = 0; i < this.props.trips.length; i++) {
            items[i] = this.props.trips[i]._id;
        }
        const { name } = this.state;
        this.props.saveTrip({ 'name': name, 'item_list': items })
        this.setState({ ['name']: '' })
    }

    update_trip = (e) => {
        let items = []
        for (let i = 0; i < this.props.trips.length; i++) {
            items[i] = this.props.trips[i]._id;
        }
        this.props.updateTrip(this.props.id_trip, { 'item_list': items });
    }

    add_item_to_trip = (e) => {
        let items = []
        for (let i = 0; i < this.props.trips.length; i++) {
            items[i] = this.props.trips[i]._id;
        }
        const { id_item, add_item, cas } = this.state;

        if (cas == 1) {
            // auto
            items = [...items.slice(0, this.props.trips.length - 1), add_item, ...items.slice(this.props.trips.length - 1)]
            this.props.addItemToTripAuto({ 'item_list': items })
        } else {
            // manual
            let index = items.indexOf(id_item) + 1;
            items = [...items.slice(0, index), add_item, ...items.slice(index)];
            this.props.addItemToTripManual({ 'item_list': items })
        }
        this.setState({ ['id_item']: '', ['cas']: 1, ['add_item']: '' });

    }

    remove_item_from_trip = (id) => {
        let items = []
        for (let i = 0; i < this.props.trips.length; i++) {
            items[i] = this.props.trips[i]._id;
        }
        items.splice(items.indexOf(id), 1)

        this.props.removeItemFromTrip({ 'item_list': items });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.trips !== prevProps.trips) {
            this.props.getRoute(this.props.trips);
        }
    }

    componentDidMount() {
        this.props.getListItems();
    }



    render() {

        const { debut, fin, number_items, name, add_item } = this.state;

        return (
            <div>
                <section className="hero">
                    <div className="container">

                        <h2 className="h1 hero-title">Your Next Journey, Optimized</h2>

                        <p className="hero-text">
                            Build, personalize, and optimize your itineraries with our free AI trip planner.
                            Designed for vacations, workations, and everyday adventures.
                        </p>

                        <div className="hero-form">
                            <form className="row g-3" onSubmit={this.onSubmit}>
                                <div className="col-md-4">
                                    <label htmlFor="in1" className="form-label">Starting in</label>
                                    <select className="form-control" id='in1' name='debut' value={debut} onChange={this.onChange}>
                                        <option value="default">enter your destination country</option>
                                        {this.props.items && this.props.items.map((item, index) => (
                                            <option value={item._id} key={index}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="in2" className="form-label">Ending in</label>
                                    <select className="form-control" id='in2' name='fin' value={fin} onChange={this.onChange}>
                                        <option value="default">enter your destination country</option>
                                        {this.props.items && this.props.items.map((item, index) => (
                                            <option value={item._id} key={index}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="in3" className="form-label">The number of places</label>
                                    <input type="number" className="form-control" id="in3" min="3" name='number_items' value={number_items} onChange={this.onChange} />
                                </div>
                                <button type='submit' disabled={!debut || !fin || !number_items} className='generate btn'>Generate itinerary</button>
                            </form>
                        </div>

                    </div>
                </section>
                <div id="wrapper" className='mt-4'>
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            <div className="container-fluid">
                                <div className="row">
                                    {/* list items */}
                                    <div className="order-2 order-xl-1 col-xl-4 col-lg-5 p-0">
                                        <div className="card border-0 mb-4">
                                            <div className="card-header">
                                                {this.props.id_trip ? (
                                                    <button type="button" className="btn btn-primary-cust mr-3"
                                                        disabled={this.props.trips && !this.props.trips.length}
                                                        data-bs-toggle="modal" data-bs-target="#confirmeUpdateModal">
                                                        Update itinerary
                                                    </button>
                                                ) : (
                                                    <button type="button" className="btn btn-primary-cust mr-3"
                                                        disabled={this.props.trips && !this.props.trips.length}
                                                        data-bs-toggle="modal" data-bs-target="#saveTripModal">
                                                        Save itinerary
                                                    </button>
                                                )}
                                                <button type='button' href="/" className="btn btn-secondary-cust"
                                                    data-bs-toggle="modal" data-bs-target="#addItemModal" name='cas' value={1} onClick={this.onChange}>
                                                    <AiOutlineAppstoreAdd className='icon' />
                                                </button>
                                            </div>
                                            <div className="card-body">
                                                {this.props.trips && this.props.trips.map((item, index) => (
                                                    <div key={index}>
                                                        <div className="card-item d-flex">
                                                            {(index != 0 && index != this.props.trips.length - 1 && this.props.trips.length > 3) && (
                                                                <button type='button' className='btn remove-item' onClick={() => this.remove_item_from_trip(item._id)}>
                                                                    <AiOutlineClose className='icon' />
                                                                </button>
                                                            )}
                                                            <div className="image-item">
                                                                <div className="number-item">0{index + 1}</div>
                                                                <img src={item.images[0].image} alt={item.name} />
                                                            </div>
                                                            <div className="item-body">
                                                                <div className="header">
                                                                    <Link to={'/blog/' + item._id} target="_blank" className='text-decoration-none'>
                                                                        <h3 className="title">{item.name}</h3>
                                                                    </Link>
                                                                    <p className="city">{item.city}, Morocco</p>
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

                                                        {index != this.props.trips.length - 1 && (
                                                            <button type='button' className='btn add-item'
                                                                data-bs-toggle="modal" data-bs-target="#addItemModal" onClick={() => this.onChange_item(item._id)}>
                                                                <AiOutlinePlus className='icon' />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}

                                                {/* <div className="card-item d-flex">
                                                    <button type='button' className='btn remove-item'>
                                                        <AiOutlineClose className='icon' />
                                                    </button>
                                                    <div className="image-item">
                                                        <div className="number-item">01</div>
                                                        <img src={img1} alt='hhh' />
                                                    </div>
                                                    <div className="item-body">
                                                        <div className="header">
                                                            <h3 className="title">title title title</h3>
                                                            <p className="city">city, country</p>
                                                        </div>
                                                        <div className="rating">
                                                            <Rating
                                                                style={{ maxWidth: 80 }}
                                                                value={4}
                                                                readOnly
                                                            />
                                                            <div className="reviews-numbers">
                                                                <AiOutlineEye className='icon' />
                                                                <p>1234</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button type='button' className='btn add-item' 
                                                data-bs-toggle="modal" data-bs-target="#addItemModal">
                                                    <AiOutlinePlus className='icon' />
                                                </button>

                                                <div className="card-item d-flex">
                                                    <div className="image-item">
                                                        <div className="number-item">01</div>
                                                        <img src={img2} alt='hhh' />
                                                    </div>
                                                    <div className="item-body">
                                                        <div className="header">
                                                            <h3 className="title">title title title title title title</h3>
                                                            <p className="city">city, country</p>
                                                        </div>
                                                        <div className="rating">
                                                            <Rating
                                                                style={{ maxWidth: 80 }}
                                                                value={4}
                                                                readOnly
                                                            />
                                                            <div className="reviews-numbers">
                                                                <AiOutlineEye className='icon' />
                                                                <p>1234</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card-item d-flex">
                                                    <div className="image-item">
                                                        <div className="number-item">01</div>
                                                        <img src={img3} alt='hhh' />
                                                    </div>
                                                    <div className="item-body">
                                                        <div className="header">
                                                            <h3 className="title">title title title title title title</h3>
                                                            <p className="city">city, country</p>
                                                        </div>
                                                        <div className="rating">
                                                            <Rating
                                                                style={{ maxWidth: 80 }}
                                                                value={4}
                                                                readOnly
                                                            />
                                                            <div className="reviews-numbers">
                                                                <AiOutlineEye className='icon' />
                                                                <p>1234</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}

                                            </div>
                                        </div>
                                    </div>

                                    {/* Map */}
                                    <div className="order-1 order-xl-2 col-xl-8 col-lg-7">
                                        <div className="card shadow mb-4">
                                            {/* body card */}
                                            <MapTrips items={this.props.trips} coords={this.props.coords} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div id='my_trips' className="trips-user mt-4">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="title-table">Show your trips</div>
                                <DataTableBase />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="saveTripModal" tabIndex="-1" aria-labelledby="saveTripModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="saveTripModalLabel">Save Trip</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="name_trip" className="col-form-label">Name:</label>
                                        <input type="text" className="form-control" id="name_trip"
                                            name='name' value={name} onChange={this.onChange} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary-cust" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary-cust" data-bs-dismiss="modal"
                                    disabled={!name} onClick={this.save_trip}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="addItemModal" tabIndex="-1" aria-labelledby="addItemModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="addItemModalLabel">Add another place</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="add_item" className="col-form-label">Select place :</label>
                                        <select className="form-control" id='add_item' name='add_item' value={add_item} onChange={this.onChange}>
                                            <option value="">enter your destination country</option>
                                            {(this.props.items && this.props.trips) && this.props.items.filter(this.filter_item).map((item, index) => (
                                                <option value={item._id} key={index}>{item.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary-cust" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary-cust" data-bs-dismiss="modal" onClick={this.add_item_to_trip}
                                    disabled={!add_item}>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="confirmeUpdateModal" tabIndex="-1" aria-labelledby="confirmeUpdateModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="confirmeUpdateModalLabel">Confirmation</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-footer text-center">
                                <button type="button" className="btn btn-secondary-cust" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-gray" data-bs-dismiss="modal" onClick={this.update_trip}>
                                    Confirme
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    items: state.items.items,
    trips: state.trips.trips,
    coords: state.coords.coords,
    id_trip: state.trips.id_trip,
});



export default connect(mapStateToProps, { getListItems, resetIdTrip, createTrip, saveTrip, updateTrip, addItemToTripManual, addItemToTripAuto, removeItemFromTrip, getRoute })(Trips);