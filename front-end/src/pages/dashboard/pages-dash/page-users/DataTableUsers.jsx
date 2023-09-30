import React, { useEffect } from 'react';
import '../../dashboard.css';
import DataTable from 'react-data-table-component';
import { BsArrowDownShort } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../../../actions/auth';

const sortIcon = <BsArrowDownShort />

function DataTableUsers() {

    const dispatch = useDispatch();

    const list_users = useSelector(state => state.auth.all_users)

    useEffect(() => {
        dispatch(getAllUsers())
    }, [])

    const columns = [
        {
            name: 'First name',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Last name',
            selector: row => row.last_name,
            sortable: true,
        },
        {
            name: 'E-mail',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Gender',
            selector: row => row.gender,
            sortable: true,
        },
        {
            name: 'City',
            selector: row => row.city,
            sortable: true,
        }
    ];

  return (
    <>
    <DataTable className='data-table-custom'
                pagination
                sortIcon={sortIcon}
                columns={columns}
                data={list_users}
                fixedHeader
            />
    </>
  )
}

export default DataTableUsers