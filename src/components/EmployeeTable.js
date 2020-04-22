import React, { useState } from 'react'
import { Table, Image, Modal, Form, Button, Icon } from 'semantic-ui-react'
import moment from 'moment'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { updateEmployee, deleteEmployee, fetchEmployees, setError } from '../store/actions'

import ImageDefault from '../assets/ImageDefault.png'
import '../views/Employees.css'

export default function EmployeeTable({ index, employee, authOptions, superiorOptions }) {
    const dispatch = useDispatch()
    const loading = useSelector(state => state.reducers.loading)
    const dbPassword = employee.password
    const roleOptions = [
        { text: 'CEO', value: 'CEO'},
        { text: 'Manager', value: 'Manager'},
        { text: 'HRD', value: 'HRD'},
        { text: 'Staff', value: 'Staff'}
    ]

    // Edit Form
    const [photo, setPhoto] = useState(employee.image_url)
    const [formContent, setFormContent] = useState({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        password: employee.password,
        birthDate: moment(employee.birthDate).format('YYYY-MM-DD'),
        address: employee.address,
        phoneNumber: employee.phoneNumber,
        role: employee.role,
        SuperiorId: employee.SuperiorId,
        authLevel: employee.authLevel,
        paidLeave: employee.paidLeave,
    })

    // Other state
    const [modal, setModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const error = useSelector(state => state.reducers.error)
    const resetForm = () => {
        setFormContent({
            id: employee.id,
            name: employee.name,
            email: employee.email,
            password: employee.password,
            birthDate: moment(employee.birthDate).format('YYYY-MM-DD'),
            address: employee.address,
            phoneNumber: employee.phoneNumber,
            role: employee.role,
            superiorId: employee.superiorId,
            authLevel: employee.authLevel,
            paidLeave: employee.paidLeave,
        })
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

    const handleSubmitForm = (event) => {
        dispatch(setError(null))
        event.preventDefault()
        
        // Guard
        if(!formContent.name) return dispatch(setError('Please input employees Full Name'))
        if(!formContent.email) return dispatch(setError('Please input employees email'))
        if(!formContent.password) return dispatch(setError('Please input employees password'))
        if(!formContent.birthDate) return dispatch(setError('Please input employees birth date'))
        if(!formContent.address) return dispatch(setError('Please input employees address'))
        if(!formContent.phoneNumber) return dispatch(setError('Please input employees phone number'))
        if(!formContent.role) return dispatch(setError('Please input employees role'))
        if(!formContent.SuperiorId) return dispatch(setError('Please input employees superior'))
        if(!formContent.authLevel) return dispatch(setError('Please input employees authority level'))

        if(formContent.password === dbPassword) {
            dispatch(updateEmployee({
                ...formContent, image_url: photo,
            }))
        } else {
            dispatch(fetchEmployees())
        }

        setModal(!modal)
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormContent({ ...formContent, [name]: value })
    }

    return (
        <Table.Row className={ index % 2 === 0 ? 'employee-table-even' : 'employee-table-odd' } textAlign='center'>
            <Table.Cell> <Image alt={employee.name} src={employee.image_url ? employee.image_url: ImageDefault} size="tiny"/> </Table.Cell>
            <Table.Cell> {employee.id} </Table.Cell>
            <Table.Cell> {employee.name} </Table.Cell>
            <Table.Cell> {employee.email} </Table.Cell>
            <Table.Cell> {employee.role} </Table.Cell>
            <Table.Cell> {employee.SuperiorId} </Table.Cell>
            <Table.Cell> {employee.authLevel} </Table.Cell>
            <Table.Cell> {moment(employee.birthDate).format('L')} </Table.Cell>
            <Table.Cell> {employee.address} </Table.Cell>
            <Table.Cell> {employee.phoneNumber} </Table.Cell>
            <Table.Cell> {employee.paidLeave} </Table.Cell>
            <Table.Cell>
                <Button style={{ backgroundColor: "#11999e", color: "white" }} animated="vertical" onClick={() => setModal(!modal)}>
                    <Button.Content visible>Edit</Button.Content>
                    <Button.Content hidden>
                        <Icon name='edit' />
                    </Button.Content>
                </Button>
                <Button style={{ backgroundColor: "#40514e", color: 'white' }} animated="vertical" onClick={() => setDeleteModal(!deleteModal)}>
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
                        name="SuperiorId"
                        value={formContent.SuperiorId}
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
                    <div className="employee-edit-container">
                        <Image id="employee-edit-photo" size="medium" src={photo} />
                        <Button.Group className="employee-edit-buttons" widths={2}>
                            <Button style={{ backgroundColor: "#11999e", color: "white" }} onClick={(event) => handleSubmitForm(event)} content="Submit" />
                            <Button.Or />
                            <Button style={{ backgroundColor: "#40514e", color: "white" }} onClick={() => { setModal(!modal) ; resetForm()}} content="Cancel" />
                        </Button.Group>
                    </div>
                </Form>
            </Modal>
            
            <Modal closeIcon onClose={() => setDeleteModal(!deleteModal)} open={deleteModal}>
                <Modal.Header>
                    Are you sure want to delete {employee.name} ?
                </Modal.Header>
                <Modal.Actions>
                    <Button onClick={() => { setDeleteModal(!deleteModal); dispatch(deleteEmployee(employee.id)) }} content="Confirm" />
                </Modal.Actions>
            </Modal>
        </Table.Row>
    )
}