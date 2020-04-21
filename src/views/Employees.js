import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Table, Dimmer, Loader, Search, Pagination } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux' 
import { fetchEmployees, createEmployee } from '../store/actions'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'
import _ from 'lodash'

import './Employees.css'
import EmployeeTable from '../components/EmployeeTable.js'
import EmptyResult from '../components/EmptyResult.js'

export default function Employees() {
    const dispatch = useDispatch()
    const history = useHistory()
    const roleOptions = [
        { text: 'CEO', value: 'CEO'},
        { text: 'Manager', value: 'Manager'},
        { text: 'HRD', value: 'HRD'},
        { text: 'Staff', value: 'Staff'}
    ]
    
    // Store statement
    let employees = useSelector(state => state.reducers.employees)
    const loading = useSelector(state => state.reducers.loading)
    // const error = useSelector(state => state.reducers.error)
    
    const chunkSize = 7 // change this value to change employee shown each page
    const [modal, setModal] = useState(false)
    const [error, setError] = useState('')

    // State for form
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [role, setRole] = useState('')
    const [superior, setSuperior] = useState(0)
    const [authLevel, setAuthLevel] = useState(0)
    const [photo, setPhoto] = useState("")
    const [paidLeave, setPaidLeave] = useState(12)
    const [search, setSearch] = useState('')
    const [activeCol, setActiveCol] = useState(null)
    const [direction, setDirection] = useState(null)
    const [data, setData] = useState([])
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [page, setPage] = useState(0)

    const resetForm = () => {
        setName('')
        setEmail('')
        setPassword('')
        setBirthDate('')
        setAddress('')
        setPhoneNumber('')
        setRole('')
        setSuperior(0)
        setAuthLevel(0)
        setPhoto('')
    }

    const handleSubmitForm = (event) => {
        setError('')
        event.preventDefault()
        
        // Guard
        if(!name) return setError('Please input employees Full Name')
        if(!email) return setError('Please input employees email')
        if(!password) return setError('Please input employees password')
        if(!birthDate) return setError('Please input employees birth date')
        if(!address) return setError('Please input employees address')
        if(!phoneNumber) return setError('Please input employees phone number')
        if(!role) return setError('Please input employees role')
        if(!superior) return setError('Please input employees superior')
        if(!authLevel) return setError('Please input employees authority level')
        
        dispatch(createEmployee({
            name, email, password, birthDate, address, phoneNumber, superiorId: superior, role, authLevel, paidLeave, image_url: photo
        }))
        setModal(!modal)
        resetForm()
    }

    const handleImage = (event) => {
        event.preventDefault()
        const newForm = new FormData();
        newForm.append('image', event.target.files[0])
        Axios({
            method: "POST",
            url: "http://18.138.253.176/admin/upload",
            headers: {
                token: localStorage.token
            },
            data: newForm
        })
            .then(({data}) => {
                setPhoto(data.fileName.location)
            })
    }

    const handleSearch = (event, { value }) => {
        setPage(0)
        setSearch(value)
        setLoadingSearch(true)

        if(value.length < 1) {
            setLoadingSearch(false)
            // return setData(employees)
            console.log(employees)
            return setData(_.chunk(employees), chunkSize)
        }
        
        setTimeout(() => {
            const re = new RegExp(_.escapeRegExp(value), 'i')
            const isMatch = (result) => re.test(result.name)
            setData(_.chunk(_.filter(employees, isMatch)), chunkSize)
            // setData(_.filter(employees, isMatch))
            setLoadingSearch(false)
          }, 300)
    }

    const handleSort = (clickedCol) => {
        if (activeCol !== clickedCol) {
            setActiveCol(clickedCol);
            setData(_.chunk(_.sortBy(_.flatten(data), [clickedCol]), chunkSize));
            setDirection('ascending');

            return
        }

        setData(_.chunk(_.sortBy(_.flatten(data), [clickedCol]).reverse(), chunkSize));
        
        if (direction === 'ascending') {
            setDirection('descending')
        } else {
            setDirection('ascending')
        }
    }

    const handlePagination = (event, { activePage }) => {
        setPage(activePage - 1)
    }

    useEffect(() => {
        if(localStorage.getItem('qr')) {
            history.replace('/qr')
        }

        if(employees.length === 0 ) {
            dispatch(fetchEmployees())
        }
        if(search.length < 1) {
            setData(_.chunk(employees, chunkSize))
        }
        // setData(employees)
        setData(_.chunk(employees, chunkSize))
    }, [dispatch, employees.length, search, history, employees])

    return (
        <div id="employees-page">
            <Modal closeIcon onClose={() => setModal(!modal)} dimmer={'blurring'} open={modal} >
                <Modal.Header>Add Employee</Modal.Header>
                <Form loading={loading} id="employees-add-form">
                    { error && <h6 id="employees-add-error"> { error } </h6> }
                    <Form.Input 
                        label="Full name" 
                        placeholder='Full Name'
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <Form.Input 
                        label="Email" 
                        placeholder='Email'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <Form.Input 
                        type="password"
                        label="Password" 
                        placeholder='Password'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <Form.Input 
                        type="date"
                        label="Birth Date" 
                        placeholder='Birth Date'
                        value={birthDate}
                        onChange={(event) => setBirthDate(event.target.value)}
                    />
                    <Form.TextArea 
                        label="Address" 
                        placeholder='Address'
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                    />
                    <Form.Input 
                        label="PhoneNumber" 
                        placeholder='PhoneNumber'
                        value={phoneNumber}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                    />
                    <Form.Select 
                        label="Role" 
                        placeholder='Role'
                        options={roleOptions}
                        onChange={(event, {value}) => setRole(value)}
                    />
                    <Form.Input 
                        label="Superior ID" 
                        placeholder='Superior ID'
                        value={superior}
                        onChange={(event) => setSuperior(event.target.value)}
                    />
                    <Form.Input 
                        label="Authority Level" 
                        placeholder='Authority Level'
                        value={authLevel}
                        onChange={(event) => setAuthLevel(event.target.value)}
                    />
                    <Form.Input 
                        label="Annual Leave" 
                        placeholder='Annual Leave'
                        value={paidLeave}
                        onChange={(event) => setPaidLeave(event.target.value)}
                    />
                    <Form.Input 
                        type="file"
                        onChange={(event) => handleImage(event)}
                    />
                    <Button primary onClick={(event) => handleSubmitForm(event)} content="Submit" />
                </Form>
            </Modal>
            <h3>Total Employees: { employees.length } </h3>
            <div className="employees-nav-container">
                <Button onClick={() => setModal(!modal)} content="Add Employee" />
                <Search
                    onSearchChange={_.debounce(handleSearch, 500, { leading: true, trailing: true })}
                    open={false}
                    value={search}
                    loading={loadingSearch}
                />
            </div>
            {/* Table */}
            {loading ? <Dimmer active inverted><Loader inverted>Loading</Loader></Dimmer> : 
                <Table sortable celled unstackable singleLine selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Photo</Table.HeaderCell>
                            <Table.HeaderCell onClick={() => handleSort('id')} sorted={activeCol === 'id' ? direction : null} >ID</Table.HeaderCell>
                            <Table.HeaderCell onClick={() => handleSort('name')} sorted={activeCol === 'name' ? direction : null}>Full Name</Table.HeaderCell>
                            <Table.HeaderCell onClick={() => handleSort('email')} sorted={activeCol === 'email' ? direction : null}>Email</Table.HeaderCell>
                            <Table.HeaderCell onClick={() => handleSort('role')} sorted={activeCol === 'role' ? direction : null}>Role</Table.HeaderCell>
                            <Table.HeaderCell onClick={() => handleSort('superior')} sorted={activeCol === 'superior' ? direction : null}>Superior</Table.HeaderCell>
                            <Table.HeaderCell onClick={() => handleSort('authLevel')} sorted={activeCol === 'authLevel' ? direction : null}>Level</Table.HeaderCell>
                            <Table.HeaderCell>Birth Date</Table.HeaderCell>
                            <Table.HeaderCell>Address</Table.HeaderCell>
                            <Table.HeaderCell>Phone Number</Table.HeaderCell>
                            <Table.HeaderCell>Annual leave</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        { data.length < 1 ? 
                            <EmptyResult /> 
                            : data[page].map(employee => <EmployeeTable key={employee.id} employee={employee} />)
                        }
                    </Table.Body>
                </Table>
            }
                { employees.length > chunkSize ? 
                <div className="employees-pagination">
                    <Pagination
                        onPageChange={handlePagination}
                        activePage={page+1}
                        boundaryRange={0}
                        ellipsisItem={null}
                        firstItem={null}
                        lastItem={null}
                        siblingRange={1}
                        disabled={Math.ceil(_.flatten(data).length / chunkSize) > 1 ? false : true}
                        totalPages={Math.ceil(_.flatten(data).length / chunkSize)}
                    />
                </div>
                : '' }
        </div>
    )
}


