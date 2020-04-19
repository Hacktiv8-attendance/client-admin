import React, { useState } from 'react'
import { Table, Image, Modal, Form, Button, Icon } from 'semantic-ui-react'
import moment from 'moment'
import ImageDefault from '../assets/ImageDefault.png'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { updateEmployee, deleteEmployee, fetchEmployees } from '../store/actions'

import '../views/Employees.css'

export default function EmployeeTable({ employee }) {
    const dispatch = useDispatch()
    const loading = useSelector(state => state.reducers.loading)
    const dbPassword = employee.password
    // Edit Form
    const [name, setName] = useState(employee.name)
    const [email, setEmail] = useState(employee.email)
    const [password, setPassword] = useState(employee.password)
    const [birthDate, setBirthDate] = useState(employee.birthDate.substr(0, 10))
    const [address, setAddress] = useState(employee.address)
    const [phoneNumber, setPhoneNumber] = useState(employee.phoneNumber)
    const [role, setRole] = useState(employee.role)
    const [superior, setSuperior] = useState(employee.superior)
    const [authLevel, setAuthLevel] = useState(employee.authLevel)
    const [photo, setPhoto] = useState(employee.image_url)
    const [paidLeave, setPaidLeave] = useState(employee.paidLeave)
    const [modal, setModal] = useState(false)
    const [error, setError] = useState('')

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
                setPhoto(data.fileName.location)
            })
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
        if(password === dbPassword) {
            dispatch(updateEmployee({
                id: employee.id, name, email, birthDate, address, phoneNumber, role, superior, image_url: photo, paidLeave, authLevel
            }))
        } else {
            dispatch(updateEmployee({
                id: employee.id, name, email, password , birthDate, address, phoneNumber, role, superior, image_url: photo, paidLeave, authLevel
            }))
            dispatch(fetchEmployees())
        }
         

        setModal(!modal)
    }

    const getFormatDate = (date) => {
        return setBirthDate(date.substr(0, 10))
    }
    
    const deleteHandle = () => {
        dispatch(deleteEmployee(employee.id))
    }

    return (
        <Table.Row>
            <Table.Cell> <Image alt={employee.name} src={employee.image_url ? employee.image_url: ImageDefault } size="tiny"/> </Table.Cell>
            <Table.Cell> {employee.id} </Table.Cell>
            <Table.Cell> {employee.name} </Table.Cell>
            <Table.Cell> {employee.email} </Table.Cell>
            <Table.Cell> {employee.role} </Table.Cell>
            <Table.Cell> {employee.superior} </Table.Cell>
            <Table.Cell> {employee.authLevel} </Table.Cell>
            <Table.Cell> { moment(employee.birthDate).format('L') } </Table.Cell>
            <Table.Cell> {employee.address} </Table.Cell>
            <Table.Cell> {employee.phoneNumber} </Table.Cell>
            <Table.Cell> {employee.paidLeave} </Table.Cell>
            <Table.Cell>
                <Button animated="vertical" onClick={() => setModal(!modal)} primary>
                    <Button.Content visible>Edit</Button.Content>
                    <Button.Content hidden>
                        <Icon name='edit' />
                    </Button.Content>
                </Button>
                <Button animated="vertical" onClick={deleteHandle} color="red">
                    <Button.Content visible>Delete</Button.Content>
                    <Button.Content hidden>
                        <Icon name='trash' />
                    </Button.Content>
                </Button>
            </Table.Cell>
            <Modal closeIcon onClose={() => setModal(!modal)} dimmer={'blurring'} open={modal}>
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
                        onChange={(event) => getFormatDate(event.target.value)}
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
                        onChange={(event) => handleImage(event)}
                    />
                    <Button primary onClick={(event) => handleSubmitForm(event)} content="Submit" />
                </Form>
            </Modal>
        </Table.Row>
    )
}