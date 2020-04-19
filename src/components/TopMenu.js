import React, { useState } from 'react'
import { Menu, Image, Form, Modal, Button } from 'semantic-ui-react'
import { useHistory, useLocation } from 'react-router-dom'
import axios from 'axios'
import './TopMenu.css'

import Logo from '../assets/Logo_small.png'

export default function Menubar() {
    const history = useHistory()
    const location = useLocation()
    const [modal, setModal] = useState(false)
    const [activeItem, setActiveItem] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const logout = (event) => {
        event.preventDefault()
        history.replace('/')
        localStorage.clear()
    }

    const handleNavClick = (event, name, path) => {
        event.preventDefault()

        if (path === '/qr') {
          localStorage.setItem('qr', true)
          history.replace(path)
        }
        else {
          history.replace(path)
        }
        setActiveItem(name)
    }

    const handleQRBack = (event) => {
      localStorage.removeItem('qr')
      setLoading(true)
      setError('')
      const email = localStorage.getItem('email')
      
      axios.post('http://localhost:3000/admin/login', { email, password })
      .then(_ => {
          setPassword('')
          setError('')
          setModal(!modal)
          history.replace('/dashboard')
        })
        .catch(err => {
          setError('Invalid password!')
        })

        .finally(() => {
          setLoading(false)
        })
    }

    if(location.pathname === '/qr') {
      return(
        <Menu stackable id="top-menu">
          <Menu.Item style={{padding: '0.5%'}}>
            <Image src={Logo} />
          </Menu.Item>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={() => setModal(!modal)}
            content="Home"
          />
          <Modal className="confirmation" onClose={() => setModal(!modal)} dimmer={'blurring'} open={modal} closeIcon>
            <Form className="form-confirmation">
              <h2>Please Type Your Password</h2>
              { error && <h5>{ error }</h5>}
              <Form.Input 
                type="password" 
                onChange={(event) => setPassword(event.target.value)} 
                placeholder='Password' 
                value={password} />
              <br />
              <Button loading={loading} primary type='submit' onClick={(event) => handleQRBack(event)}>Confirm</Button>
            </Form>
          </Modal>
        </Menu>
      )
    }

    return (
        <Menu stackable id="top-menu">
          <Menu.Item style={{padding: '0.5%'}}>
            <Image src={Logo} />
          </Menu.Item>
          <Menu.Item
            name='dashboard'
            active={activeItem === 'dashboard'}
            onClick={(event, { name }) => handleNavClick(event, name, '/dashboard')}
            content="Dashboard"
          />
          <Menu.Item
            name='employees'
            active={activeItem === 'employees'}
            onClick={(event, { name }) => handleNavClick(event, name, '/employees')}
            content="Employees"
          />
          <Menu.Item
            name='qr'
            active={activeItem === 'qr'}
            onClick={(event, { name }) => handleNavClick(event, name, '/qr')}
            content="QR"
          />
          <Menu.Menu position='right'>
            <Menu.Item
              name='logout'
              onClick={(event) => logout(event)}
            />
          </Menu.Menu>
        </Menu>
    )
}
