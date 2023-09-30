import React, { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { BsArrowDownShort } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { getAllItems } from '../../../../actions/items';

const sortIcon = <BsArrowDownShort />

function DataTableItems() {

    const dispatch = useDispatch();
    const list_items = useSelector(state => state.items.all_items)

    useEffect(() => {
        dispatch(getAllItems())
    }, [])

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.category,
            sortable: true,
        },
        {
            name: 'Stars',
            selector: row => row.stars,
            sortable: true,
        },
        {
            name: 'Latitude and Longitude',
            selector: row => `(${row.Latitude}, ${row.Longitude})`,
            sortable: true,
        },
        {
            name: 'City',
            selector: row => row.city,
            sortable: true,
        },
        // {
        //     name: 'Action',
        //     cell: (row) => (
        //         <div className='action-button'>
        //             <button type='button' className='btn btn-action-show' >
        //                 <AiFillEdit className='icon' />
        //             </button>
        //         </div>
        //     ),
        // }
    ];

  return (
    <>
    <DataTable className='data-table-custom'
                pagination
                sortIcon={sortIcon}
                columns={columns}
                data={list_items}
                fixedHeader
            />
    </>
  )
}

export default DataTableItems