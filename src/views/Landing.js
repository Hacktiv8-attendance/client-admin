import React, { useState } from 'react'
import './Landing.css'
import { Container, Image, Form, Button } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import _ from 'lodash'

import HRQLogo from '../assets/HRQ.jpg'
import LandingSVG from '../assets/Landing.svg'

export default function Landing() {
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLoginClick = (event) => {
        // Guard
        if(!email || !password) return setError('Invalid email/password')

        // if email and password filled
        const loginUrl = "http://localhost:3000/admin/login"
        event.preventDefault()
        setError('')
        setLoading(true)

        axios
            .post(loginUrl, { email, password })
            .then(({ data }) => {
                localStorage.setItem('token', data.token)
                history.push('/dashboard')
                setEmail('')
                setPassword('')
            })
            .catch(err => {
                setError(_.get(err, 'response.data.message'))
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div id="landing-page">
            <Container id="landing-item">
            <Image src={LandingSVG} size="large"/>
                <div id="landing-title">
                    <h1>Welcome to HRQ</h1>

                    <Image src={HRQLogo} size="small" />
                    
                    <Form id="landing-login">
                        <Form.Input 
                            disabled={loading}
                            value={email}
                            placeholder="Email"
                            name="email"
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <Form.Input
                            disabled={loading} 
                            type="password"
                            value={password}
                            placeholder="Password"
                            name="password"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        { error ? <small id="error-login">{error}</small> : '' }
                        <Button 
                            id="btn-login"
                            content="Login"
                            loading={loading}
                            onClick={(event) => handleLoginClick(event)}
                        />
                    </Form>

                </div>
            </Container>
        </div>
    )
}
