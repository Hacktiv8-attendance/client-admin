import React, { useState, useEffect } from 'react'
import { Form, Modal, Button, Table } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { broadcastMessage } from '../store/actions'
import { NotificationManager } from 'react-notifications'
import { fetchMessages } from '../store/actions'

import BroadcastTable from './BroadcastTable.js'

export default function DashboardBroadcast() {
    const messages = useSelector(state => state.reducers.messages)
    const dispatch = useDispatch()
    const [message, setMessage] = useState('')
    const [title, setTitle] = useState('')
    const [modal, setModal] = useState(false)

    const handleBroadcastSubmit = (event) => {
        event.preventDefault()

        // Guard
        if(!title) return NotificationManager.warning("Please input title", "ERROR")
        if(title.length < 5) return NotificationManager.warning("Title at least 5 characters", "ERROR")
        if(title.length > 25) return NotificationManager.warning("Title can't be longer than 25 characters", "ERROR")

        if(!message) return NotificationManager.warning("Please input message", "ERROR")
        if(message.length > 255) return NotificationManager.warning("Message can't be longer than 255 characters", "ERROR")

        dispatch(broadcastMessage({ title, message }))
        setMessage('')
        setModal(!modal)
    }

    useEffect(() => {
        dispatch(fetchMessages())
    }, [dispatch])

    return (
        <div id="dashboard-broadcast-message">
            <h1 style={{ backgroundColor: "#e4f9f5" }}>Broadcast message to all employees</h1>
            <div id="dashboard-broadcast-form">
                <Form>
                    <Form.Input
                        label="Title"
                        value={title}
                        placeholder="Title"
                        onChange={(event) => setTitle(event.target.value)}
                    />
                    <small className="dashboard-broadcast-counter" style={{ color: title.length > 25 || title.length < 5 ? 'red' : 'black' }}>{title.length}/25</small>
                    <br />
                    <Form.TextArea 
                        label="Message"
                        value={message}
                        placeholder="Message"
                        onChange={(event) => setMessage(event.target.value)} />
                    <small className="dashboard-broadcast-counter" style={{ color: message.length > 255 ? 'red' : 'black' }}>{message.length}/255</small>

                    <Form.Button 
                        style={{ backgroundColor: "#30e3ca", color: "white" }}
                        onClick={() => {
                            setModal(!modal)
                        }}
                        content="Submit"
                        disabled={message.length > 255 ? true : false } 
                    />
                </Form>
            </div>
            <div id="dashboard-broadcast-table">
                <Table padded fixed singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Title</Table.HeaderCell>
                            <Table.HeaderCell>Message</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {messages.map(message => <BroadcastTable message={message} key={message.id} />)}
                    </Table.Body>
                </Table>
            </div>
            <div id="dashboard-broadcast-modal">
                <Modal 
                    onClose={() => setModal(!modal)}
                    open={modal} 
                    closeIcon
                >
                    <Modal.Header>Broadcast Confirmation</Modal.Header>
                    <Modal.Content>
                        <div className="broadcast-modal-body">
                            <Modal.Description>Are you sure want to broadcast</Modal.Description>
                            <br /><br />
                            <Modal.Description><h3>{title}</h3></Modal.Description>
                            <br />
                            <Modal.Description>"{message}"</Modal.Description>
                        </div>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button fluid id="broadcast-modal-yes-btn" onClick={(event) => handleBroadcastSubmit(event)} content="Yes" />
                    </Modal.Actions>
                </Modal>
            </div>
        </div>
    )
}
