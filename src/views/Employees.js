import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Table } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux' 
import { fetchEmployees, createEmployee } from '../store/actions'

import './Employees.css'
import EmployeeTable from '../components/EmployeeTable.js'
import Axios from 'axios'

export default function Employees() {
    const dispatch = useDispatch()

    // Store statement
    let employees = useSelector(state => state.reducers.employees)
    const loading = useSelector(state => state.reducers.loading)
    // const error = useSelector(state => state.reducers.error)

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
    const [superior, setSuperior] = useState(null)
    const [authLevel, setAuthLevel] = useState(null)
    const [photo, setPhoto] = useState("")
    const [paidLeave, setPaidLeave] = useState(12)

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
            name, email, password, birthDate, address, phoneNumber, superior, role, authLevel, paidLeave
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
            url: "http://localhost:3000/admin/upload",
            headers: {
                token: localStorage.token
            },
            data: newForm
        })
            .then(({data}) => {
                console.log(data)
            })
    }

    useEffect(() => {
        if(employees.length === 0 ) {
            dispatch(fetchEmployees())
        }
    }, [dispatch, employees.length])

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
                    <Form.Input 
                        label="Role" 
                        placeholder='Role'
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
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
                        label="Annual Level" 
                        placeholder='Annual Level'
                        value={paidLeave}
                        onChange={(event) => setPaidLeave(event.target.value)}
                    />
                    <Form.Input 
                        type="file"
                        label="Photo" 
                        placeholder='Photo'
                        value={photo}
                        onChange={(event) => handleImage(event)}
                    />
                    <Button primary onClick={(event) => handleSubmitForm(event)} content="Submit" />
                </Form>
            </Modal>

            <h1>Ini Employees</h1>
            <h3>Total Employees: { employees.length } </h3>
            <Button onClick={() => setModal(!modal)} content="Add Employee" />
            <img src="https://drive.google.com/file/d/1kaW4lAGSRs3EjqPL9u_G3mRSw20je8y_/preview"/>
            {/* Table */}
            <Table sortable celled fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Photo</Table.HeaderCell>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell >Full Name</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Role</Table.HeaderCell>
                        <Table.HeaderCell>Superior</Table.HeaderCell>
                        <Table.HeaderCell>Level</Table.HeaderCell>
                        <Table.HeaderCell>Birth Date</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>Phone Number</Table.HeaderCell>
                        <Table.HeaderCell>Annual leave remaining</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    { employees.map(employee => <EmployeeTable key={employee.id} employee={employee} />)}
                </Table.Body>
            </Table>
        </div>
    )
}


