import './popular.css'
import React, { useEffect, useRef } from 'react'
import { settingsPopular } from '../../../data'
import { BsArrowLeftShort, BsArrowRightShort, BsDot } from 'react-icons/bs'

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useDispatch, useSelector } from 'react-redux';
import { getCollaborativeItem } from '../../../actions/items';
import { Link } from 'react-router-dom';

export const Popular = () => {
    const dispatch = useDispatch();

    const arrowRef = useRef(null);

    useEffect(() => {
        dispatch(getCollaborativeItem())
    }, []);

    const items_coll = useSelector(state => state.items.items_coll);

    return (
        <section className="popular container">
            <div className="secHeader d-flex">
                <div className="textDiv">
                    <h2 className="secTitle">
                        Popular Destination
                    </h2>
                    <p>
                        From historical cities to natural
                        specteculars, come see the best of the world!
                    </p>
                </div>

                <div className="iconsDiv d-flex">
                    <button onClick={() => arrowRef.current.slickPrev()}>
                        <BsArrowLeftShort className='icon leftIcon' />
                    </button>

                    <button onClick={() => arrowRef.current.slickNext()}>
                        <BsArrowRightShort className='icon' />
                    </button>
                </div>
            </div>

            <div className="secContent">
                <Slider className='test' ref={arrowRef} {...settingsPopular}>
                    {items_coll.length && items_coll.map((item, index) => {
                        return (
                            <div key={index} className='cardDestination'>
                                <div className="signleDestination">
                                    <div className="destImage">

                                        <img src={item.images && item.images[0].image} alt={item.name} />

                                        <div className="overlayInfo">
                                            <h3>{item.name}</h3>
                                            <p>
                                                {item.city}
                                            </p>
                                            <Link to={`/blog/${item._id}`}><BsArrowRightShort className='icon' /></Link>
                                        </div>

                                    </div>

                                    <div className="destFooter">
                                        <div className="number">
                                            0{index+1}
                                        </div>

                                        <div className="destText flex">
                                            <h6>
                                                {item.city}
                                            </h6>
                                            <span className="flex">
                                                <span className="dot">
                                                    <BsDot className='icon' />
                                                </span>
                                                Morocco
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    }
                </Slider>
            </div>
        </section>
    )
}


export default Popular