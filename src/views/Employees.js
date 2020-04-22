import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Table, Dimmer, Loader, Search, Pagination } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux' 
import { fetchEmployees, createEmployee, setError } from '../store/actions'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'
import _ from 'lodash'

import './Employees.css'
import EmployeeTable from '../components/EmployeeTable.js'
import EmptyResult from '../components/EmptyResult.js'
import moment from 'moment'

export default function Employees() {
    const dispatch = useDispatch()
    const history = useHistory()
    
    // Store statement
    let employees = useSelector(state => state.reducers.employees)
    const loading = useSelector(state => state.reducers.loading)
    const error = useSelector(state => state.reducers.error)
    
    const chunkSize = 7 // change this value to change employee shown each page
    const [modal, setModal] = useState(false)
    const superiorOptions = _.chain(employees)
                                .filter(employee => employee.authLevel < 3)
                                .map(employee => ({ text: `${employee.id} - ${employee.name}`, value: employee.id }))
                                .value()
    const roleOptions = [
        { text: 'CEO', value: 'CEO'},
        { text: 'Manager', value: 'Manager'},
        { text: 'HRD', value: 'HRD'},
        { text: 'Staff', value: 'Staff'}
    ]
    const authOptions = [
        { text: 1, value: 1},
        { text: 2, value: 2},
        { text: 3, value: 3},
    ]
                                

    // State for form
    const [photo, setPhoto] = useState('')
    const [search, setSearch] = useState('')
    const [activeCol, setActiveCol] = useState(null)
    const [direction, setDirection] = useState(null)
    const [data, setData] = useState([])
    const [loadingSearch, setLoadingSearch] = useState(false)
    const [page, setPage] = useState(0)
    const [formContent, setFormContent] = useState({
        name: '',
        email: '',
        password: '',
        birthDate: moment().format('YYYY-MM-DD'),
        address: '',
        phoneNumber: '',
        role: '',
        superiorId: 0,
        authLevel: 0,
        paidLeave: 12,
    })

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormContent({ ...formContent, [name]: value })
    }

    const resetForm = () => {
        setFormContent({
            name: '',
            email: '',
            password: '',
            birthDate: moment().format('YYYY-MM-DD'),
            address: '',
            phoneNumber: '',
            role: '',
            superiorId: 0,
            authLevel: 0,
            paidLeave: 12,
        })
    }

    const handleSubmitForm = (event) => {
        dispatch(setError(null))
        event.preventDefault()
        
        // Guard
        if(!formContent.name) return dispatch(setError("Please input employee's name"))
        if(!formContent.email) return dispatch(setError('Please input employees email'))
        if(!formContent.password) return dispatch(setError('Please input employees password'))
        if(!formContent.birthDate) return dispatch(setError('Please input employees birth date'))
        if(!formContent.address) return dispatch(setError('Please input employees address'))
        if(!formContent.phoneNumber) return dispatch(setError('Please input employees phone number'))
        if(!formContent.role) return dispatch(setError('Please input employees role'))
        if(!formContent.superiorId) return dispatch(setError('Please input employees superior'))
        if(!formContent.authLevel) return dispatch(setError('Please input employees authority level'))
        
        dispatch(createEmployee({ ...formContent, image_url: photo }))
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
            return setData(_.chunk(employees), chunkSize)
        }
        
        setTimeout(() => {
            const re = new RegExp(_.escapeRegExp(value), 'i')
            const isMatch = (result) => re.test(result.name)
            setData(_.chunk(_.filter(employees, isMatch)), chunkSize)
            setLoadingSearch(false)
          }, 300)
    }

    const handleSort = (clickedCol) => {
        if (activeCol !== clickedCol) {
            setActiveCol(clickedCol);
            setData(_.chunk(_.sortBy(_.flatten(data), [clickedCol]), chunkSize));

            if (direction === 'ascending') {
                setDirection('descending')
            } else {
                setDirection('ascending')
            };

            return
        }

        if (direction === 'ascending') {
            setData(_.chunk(_.sortBy(_.flatten(data), [clickedCol]).reverse(), chunkSize));
            setDirection('descending')
        } else {
            setData(_.chunk(_.sortBy(_.flatten(data), [clickedCol]), chunkSize));
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
        setData(_.chunk(employees, chunkSize))
    }, [dispatch, employees.length, search, history, employees])

    return (
        <div id="employees-page">
            <Modal closeIcon onClose={() => { setModal(!modal); dispatch(setError(null)); resetForm() }} dimmer={'blurring'} open={modal} >
                <Modal.Header>Add New Employee</Modal.Header>
                <Form loading={loading} id="employees-add-form">
                    { error && <h6 id="employees-add-error"> { error } </h6> }
                    <Form.Input 
                        className="employee-add-form-input"
                        label="Full name" 
                        placeholder='Full Name'
                        name="name"
                        value={formContent.name}
                        onChange={handleChange}
                    />
                    <Form.Input 
                        className="employee-add-form-input"
                        label="Email" 
                        name="email"
                        placeholder='Email'
                        value={formContent.email}
                        onChange={handleChange}
                    />
                    <Form.Input 
                        className="employee-add-form-input"
                        type="password"
                        name="password"
                        label="Password" 
                        placeholder='Password'
                        value={formContent.password}
                        onChange={handleChange}
                    />
                    <Form.Input 
                        className="employee-add-form-input"
                        type="date"
                        name="birthDate"
                        label="Birth Date" 
                        placeholder='Birth Date'
                        value={formContent.birthDate}
                        onChange={handleChange}
                    />
                    <Form.TextArea 
                        className="employee-add-form-input"
                        label="Address" 
                        placeholder='Address'
                        name="address"
                        value={formContent.address}
                        onChange={handleChange}
                    />
                    <Form.Input 
                        className="employee-add-form-input"
                        label="PhoneNumber" 
                        placeholder='PhoneNumber'
                        name="phoneNumber"
                        value={formContent.phoneNumber}
                        onChange={handleChange}
                    />
                    <Form.Select 
                        className="employee-add-form-input"
                        label="Role"
                        placeholder="Role"
                        name="role"
                        value={formContent.role}
                        options={roleOptions}
                        onChange={(event, target) => handleChange({ target })}
                    />
                    <Form.Select
                        className="employee-add-form-input"
                        label="Superior ID"
                        placeholder="Superior ID"
                        search
                        searchInput={{ id: "superiorId" }}
                        name="superiorId"
                        value={formContent.superiorId}
                        options={superiorOptions}
                        onChange={(event, target) => handleChange({ target })}
                    />
                    <Form.Select 
                        className="employee-add-form-input"
                        label="Authority Level" 
                        placeholder="Authority Level"
                        options={authOptions}
                        name="authLevel"
                        value={formContent.authLevel}
                        onChange={(event, target) => handleChange({ target })}
                    />
                    <Form.Input 
                        className="employee-add-form-input"
                        label="Annual Leave" 
                        placeholder='Annual Leave'
                        name="paidLeave"
                        value={formContent.paidLeave}
                        onChange={handleChange}
                    />
                    <Form.Input 
                        className="employee-add-form-input"
                        type="file"
                        label="Employee Photo"
                        onChange={(event) => handleImage(event)}
                    />
                    <Button primary onClick={(event) => handleSubmitForm(event)} content="Submit" />
                </Form>
            </Modal>
            <h3>Total Employees: { employees.length } </h3>
            <div className="employees-nav-container">
                <Button onClick={() => setModal(!modal)} id="employees-add-button" content="Add Employee" />
                <Search
                    onSearchChange={_.debounce(handleSearch, 500, { leading: true, trailing: true })}
                    open={false}
                    value={search}
                    loading={loadingSearch}
                />
            </div>
            {/* Table */}
            {loading ? <Dimmer active inverted><Loader inverted>Loading</Loader></Dimmer> : 
                <Table sortable unstackable singleLine selectable>
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
                            : data[page].map((employee, index) => <EmployeeTable key={employee.id} employee={employee} authOptions={authOptions} index={index} superiorOptions={superiorOptions} />)
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


