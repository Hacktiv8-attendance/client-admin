import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux' 
import axios from 'axios'
import { NotificationManager } from 'react-notifications'
import { fetchEmployees } from '../store/actions'

import './Employees.css'

export default function Employees() {
    const dispatch = useDispatch()
    const employees = useSelector(state => state.reducers.employees)
    // const error = useSelector(state => state.reducers.error)
    // const loading = useSelector(state => state.reducers.loading)
    
    useEffect(() => {
        dispatch(fetchEmployees())
    }, [])

    const [modal, setModal] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

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
    const [photo, setPhoto] = useState('')

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
        const token = localStorage.getItem('token')
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
        
        setLoading(true)
        axios({
            method: "POST",
            url: "http://localhost:3000/admin/employee",
            headers: { token },
            data: {
                name, email, password, birthDate, address, role, superior, authLevel
            }
        })
            .then(({ data }) => {
                console.log(data)
                NotificationManager.success(`Added ${data.name}`, 'Success!')
                setModal(!modal)
                resetForm()
            })
            .catch(err => {
                setError(err.response.data.errors[0])
            })
            .finally(() => {
                setLoading(false)
            })
    }


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
                        type="file"
                        label="Photo" 
                        placeholder='Photo'
                        value={photo}
                        onChange={(event) => setPhoto(event.target.value)}
                    />
                    <Button primary onClick={(event) => handleSubmitForm(event)} content="Submit" />
                </Form>
            </Modal>

            <h1>Ini Employees</h1>
            <h3>Total Employees: </h3>
            <Button onClick={() => setModal(!modal)} content="Add Employee" />
        </div>
    )
}


