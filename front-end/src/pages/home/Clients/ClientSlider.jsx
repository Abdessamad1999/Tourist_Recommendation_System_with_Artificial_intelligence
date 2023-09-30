import React from 'react'
import './clientslider.css'
import {IoIosQuote} from "react-icons/io";
import {AiOutlineStar} from "react-icons/ai";

const ClientSlider = (props) => {
    const {name, position, img_url, stars, disc} = props.item;
  return (
    <div className='Container'>
        <div className='Header'>
            <span className='quote'><IoIosQuote/></span>
            <div>
                {Array(stars).fill().map((_, i) => (
                    <span className='star' key={i}>
                        <AiOutlineStar/>
                    </span>
                ))}
            </div>
        </div>
        <p className='Body'>
            {disc}
        </p>
        <div className='Footer'>
            <img src={img_url} alt={name} />
            <div className="details">
                <h1>{name}</h1>
                <p>{position}</p>
            </div>
        </div>
    </div>
  )
}

export default ClientSlider

