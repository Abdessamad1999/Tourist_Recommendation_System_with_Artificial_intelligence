import React, { useState } from 'react';
import { MAPBOX_TOKEN } from '../../data';
import Map, { GeolocateControl, Marker, Popup, Source, Layer, FullscreenControl, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AiOutlineEye } from 'react-icons/ai';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import './tripplanning.css';



function MapTrips(props) {

    const coords = props.coords ? props.coords : [];
    const [popupInfo, setPopupInfo] = useState(null);
    const [long , lat] = (props.items && props.items.length) ? longLatCenter(props.items) : [-4.775864111370216, 31.07785265525966];

    const geojson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "feature",
            "geometry": {
                "type": "LineString",
                "coordinates": coords
            }
        }]
    }

    const lineStyle = {
        id: 'roadLayer',
        type: 'line',
        layout: {
            "line-join": "round",
            "line-cap": "round"
        },
        paint: {
            "line-color": "blue",
            "line-width": 4,
            "line-opacity": 0.75
        }
    };

    return (
        <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={{
                longitude: long,
                latitude: lat,
                zoom: 6,
            }}
            mapStyle="mapbox://styles/abdessamad1999/clmjolc2w01t401r74hgd6jvr"
        >
            <Source id='routeSource' type='geojson' data={geojson}>
                <Layer {...lineStyle} />
            </Source>
            <GeolocateControl
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
            />
            <FullscreenControl />
            <NavigationControl />
            {props.items && props.items.map((item, index) => (
                <Marker key={index} longitude={item.Longitude} latitude={item.Latitude}
                    anchor='bottom'
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        setPopupInfo({ item: item, index: index + 1 });
                    }}
                >
                    <div className="marker">
                        <span><b>{index + 1}</b></span>
                    </div>
                </Marker>
            ))}

            {popupInfo &&
                <Popup anchor='top'
                    longitude={Number(popupInfo.item.Longitude)}
                    latitude={Number(popupInfo.item.Latitude)}
                    onClose={() => setPopupInfo(null)}>
                    <div className="card-item d-flex">
                        <div className="image-item">
                            <div className="number-item">0{popupInfo.index}</div>
                            <img src={popupInfo.item.images[0].image} alt={popupInfo.item.name} />
                        </div>
                        <div className="item-body">
                            <div className="header">
                                <h3 className="title">{popupInfo.item.name}</h3>
                                <p className="city">{popupInfo.item.city}, country</p>
                            </div>
                            <div className="rating">
                                <Rating
                                    style={{ maxWidth: 80 }}
                                    value={popupInfo.item.stars}
                                    readOnly
                                />
                                <div className="reviews-numbers">
                                    <AiOutlineEye className='icon' />
                                    <p>{popupInfo.item.review_count}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Popup>
            }
        </Map>
    )
}

const longLatCenter = (items) => {
    let long = 0;
    let lat = 0;
    for (const item of items){
        long += item.Longitude;
        lat += item.Latitude;
    }
    long /= items.length
    lat /= items.length
    return [long,lat];
}

export default MapTrips;