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
    const [modal, setModal] = useState(false)

    const handleBroadcastSubmit = (event) => {
        event.preventDefault()

        if(!message) return NotificationManager.warning("Please input message", "ERROR")
        if(message.length > 255) return NotificationManager.warning("Message can't be longer than 255 characters", "ERROR")

        dispatch(broadcastMessage({ message }))
        setMessage('')
        setModal(!modal)
    }

    useEffect(() => {
        dispatch(fetchMessages())
    }, [dispatch])

    return (
        <div id="dashboard-broadcast-message">
            <h1>Broadcast message to all employees</h1>
            <div id="dashboard-broadcast-form">
                <Form>
                    <Form.TextArea 
                        label="Message"
                        value={message}
                        placeholder="Message"
                        onChange={(event) => setMessage(event.target.value)} />
                    <small id="dashboard-broadcast-counter" style={{ color: message.length > 255 ? 'red' : 'black' }}>{message.length}/255</small>

                    <Form.Button 
                        // onClick={(event) => handleBroadcastSubmit(event)}
                        onClick={() => {
                            if(!message) return NotificationManager.warning("Please input message", "ERROR")
                            setModal(!modal)
                        }}
                        content="Submit"
                        disabled={message.length > 255 ? true : false}
                    />
                </Form>
            </div>
            <div id="dashboard-broadcast-table">
                <Table padded fixed singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Date</Table.HeaderCell>
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
