import React, { useEffect, useState } from 'react';
import { MAPBOX_TOKEN } from '../../../../data';
import Map, { Marker, Popup, Source, Layer, FullscreenControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import '@smastrom/react-rating/style.css';
import axios from 'axios';
import '../offers.css';



function MapOffers(props) {

    const [coords, setCoords] = useState([]);

    const [long, lat] = longLatCenter(props.items);

    useEffect(() => {
        const p = points(props.items);
        axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${p}?steps=true&overview=full&geometries=geojson&access_token=${MAPBOX_TOKEN}`)
            .then(res => setCoords(res.data.routes[0].geometry.coordinates))
            .catch(err => console.log(err))
    }, [])

    const [popupInfo, setPopupInfo] = useState(null);

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
            <FullscreenControl />
            {props.items && props.items.map((item, index) => (
                <Marker key={index} longitude={item.Longitude} latitude={item.Latitude}
                    anchor='top'
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
                <Popup anchor='bottom'
                    longitude={Number(popupInfo.item.Longitude)}
                    latitude={Number(popupInfo.item.Latitude)}
                    onClose={() => setPopupInfo(null)}>
                    <p className="title">{popupInfo.item.name}</p>
                </Popup>
            }
        </Map>
    )
}

const points = (items) => {
    let points_str = ``
    items.map((item, index) => {
        if (index) {
            points_str += `;${item.Longitude},${item.Latitude}`
        } else {
            points_str += `${item.Longitude},${item.Latitude}`
        }
    })

    return points_str;
}

const longLatCenter = (items) => {
    let long = 0;
    let lat = 0;
    for (const item of items) {
        long += item.Longitude;
        lat += item.Latitude;
    }
    long /= items.length
    lat /= items.length
    return [long, lat];
}

export default MapOffers;