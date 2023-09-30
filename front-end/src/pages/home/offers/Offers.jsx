import React from 'react';
import './offers.css';
import { BsArrowRightShort } from 'react-icons/bs';
import { MdLocationOn } from 'react-icons/md';
import { offers } from '../../../data';
import MapOffers from './map/MapOffers';
import { loadTripOffer, resetIdTrip } from '../../../actions/trips';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Offers() {

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const navigate = useNavigate();

    const onClick = (list_items) => {
        
        if (isAuthenticated) {
            let items = []
            for (let i = 0; i < list_items.length; i++) {
                items[i] = list_items[i]._id
            }
            dispatch(loadTripOffer({ 'list_items': items }));
            dispatch(resetIdTrip());
            navigate('/travel')
        } else {
            navigate("/login");
        }
    }

    return (
        <section className="offer">
            <div className="textDiv">
                <h2 className="secTitle">
                    Special Offers
                </h2>
                <p>
                    From historical cities to natural
                    specteculars, come see the best of the world!
                </p>
            </div>

            <div className="mainContent container d-grid">

                {offers && offers.map((offer, index) => (
                    <div key={index} className="singleOffer">
                        <div className="map_trip">
                            <div className='map'>
                                <MapOffers items={offer.list_items} />
                            </div>
                        </div>

                        <div className="offer_body">
                            <div>
                                <h4>
                                    {offer.list_items.length} items
                                </h4>

                                <div className="list_categories d-flex">
                                    {offer.categories.map((category, j) => (
                                        <div key={j} className="category d-flex">
                                            {Object.keys(category)[0]}
                                            <small>{Object.values(category)[0]}</small>
                                        </div>
                                    ))}
                                </div>

                                <div className="start_end">
                                    <div className="location mb-2 d-flex align-items-center">
                                        <MdLocationOn className="icon" />
                                        Starting in:
                                        <small>{offer.list_items[0].name}</small>
                                    </div>
                                    <div className="location d-flex align-items-center">
                                        <MdLocationOn className="icon" />
                                        Ending in:
                                        <small>{offer.list_items[offer.list_items.length - 1].name}</small>
                                    </div>
                                </div>
                            </div>
                            <button type='button' className="btn btn-details d-flex align-items-center " onClick={() => onClick(offer.list_items)}>
                                View Details
                                <BsArrowRightShort className="icon" />
                            </button>

                        </div>
                    </div>
                ))}

            </div>
        </section>
    )
}

export default Offers;