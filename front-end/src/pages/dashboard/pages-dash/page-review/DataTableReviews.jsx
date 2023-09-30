import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsArrowDownShort, BsTrash } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReview, getAllReviews } from '../../../../actions/reviews';

const sortIcon = <BsArrowDownShort />

function DataTableReviews() {

    const dispatch = useDispatch();

    const [idReview, setIdReview] = useState('');
    
    useEffect(() => {
        dispatch(getAllReviews())
        console.log('A1')
    }, [])

    const [isEdit, setIsEdit] = useState(false);

    const delete_review = (id) => {
        dispatch(deleteReview(id));
        setIsEdit(true)
    }

    useEffect(() => {
        if (isEdit){
            console.log('hhh')
            dispatch(getAllReviews())
            setIsEdit(false)
        }
        
    }, [isEdit])

    const list_reviews = useSelector(state => state.reviews.all_reviews);

    const columns = [
        {
            name: 'User',
            selector: row => row.user,
            sortable: true,
        },
        {
            name: 'Item',
            selector: row => row.item,
            sortable: true,
        },
        {
            name: 'Rating',
            selector: row => row.rating,
            sortable: true,
        },
        {
            name: 'Comment',
            selector: row => row.comment,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className='action-button'>
                    <button type='button' className='btn btn-action-delete' data-bs-toggle="modal" data-bs-target="#confirmeModal" onClick={() => setIdReview(row.id)}>
                        <BsTrash className='icon' />
                    </button>
                </div>
            ),
        }
    ];

    return (
        <>
            <DataTable className='data-table-custom'
                pagination
                sortIcon={sortIcon}
                columns={columns}
                data={list_reviews}
                fixedHeader
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
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => delete_review(idReview)}>
                                Confirme
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DataTableReviews