import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsArrowDownShort, BsTrash, BsEyeFill } from 'react-icons/bs';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import './datatable.css';
import { useDispatch, useSelector } from 'react-redux';
import { getTrips, getTrip, deleteTrip, likeDislike } from '../../actions/trips';

const sortIcon = <BsArrowDownShort />

function DataTableBase(props) {

    // redux
    const dispatch = useDispatch();

    const [idTrip, setIdTrip] = useState('');
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        dispatch(getTrips())

        if (update){
            dispatch(getTrips());
            setUpdate(false); 
        }
    }, [update, dispatch])

    const delete_trip = (id_trip) => {
        dispatch(deleteTrip(id_trip));
    }

    const view_trip = (id_trip) => {
        dispatch(getTrip(id_trip))
    }

    const like_dislike = (id_trip) => {
        dispatch(likeDislike(id_trip));
        setUpdate(true);
    }

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Source',
            selector: row => row.source,
            sortable: true,
        },
        {
            name: 'Destination',
            selector: row => row.destination,
            sortable: true,
        },
        {
            name: 'Nubmer of item',
            selector: row => row.nb_items,
            sortable: true,
        },
        {
            name: 'Like',
            selector: row => (row.like ? (
                <div className="action-button">
                    <button type='button' className='btn btn-action-like' onClick={() => like_dislike(row.id)}>
                        <AiFillLike className='icon' />
                    </button>
                </div>
            ) : (
                <div className="action-button">
                    <button type='button' className='btn btn-action-dislike' onClick={() => like_dislike(row.id)}>
                        <AiFillDislike className='icon' />
                    </button>
                </div>
            )),
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className='action-button'>
                    <button type='button' className='btn btn-action-delete' data-bs-toggle="modal" data-bs-target="#confirmeModal" onClick={() => setIdTrip(row.id)}>
                        <BsTrash className='icon' />
                    </button>
                    <button type='button' className='btn btn-action-show' onClick={() => view_trip(row.id)}>
                        <BsEyeFill className='icon' />
                    </button>
                </div>
            ),
        }
    ];

    const list_trip = useSelector(state => state.trips.list_trips);

    return (
        <>
            <DataTable className='data-table-custom'
                pagination
                sortIcon={sortIcon}
                columns={columns}
                data={list_trip}
                fixedHeader
                {...props}
            />

            <div className="modal fade" id="confirmeModal" tabIndex="-1" aria-labelledby="confirmeModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="confirmeModalLabel">Confirmation</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-footer text-center">
                            <button type="button" className="btn btn-secondary-cust" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => delete_trip(idTrip)}>
                                Confirme
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DataTableBase;