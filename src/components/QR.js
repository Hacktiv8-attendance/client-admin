import React, { useState } from 'react'
import QRcode from 'qrcode.react'
import axios from 'axios'
import { Button, Image, Container } from 'semantic-ui-react'
import HSQLogo from '../assets/HRQ.jpg'
import moment from 'moment'
// import 'moment/locale/id'

import './QR.css'

export default function QR() {
    const [QR, setQR] = useState('');
    const [clock, setClock] = useState('')
    const [disabled, setDisabled] = useState(false)

    const greetings = (hour) => {
        if(hour >= 4 && hour < 12) return 'morning'
        if(hour >= 12 && hour <= 18) return 'afternoon'
        else return 'evening'
    }

    setInterval(() => {
        setClock(moment(new Date()).format("dddd, MMMM Do YYYY, HH:mm:ss"))
    }, 10000)

    const getQRcode = (event) => {
        setDisabled(true)
        event.preventDefault()
        const token = localStorage.getItem('token')

        axios({
            method: "GET",
            url: "http://localhost:3000/admin/QR",
            headers: { token }
        })
            .then(({ data }) => {
                setQR(data.token)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setInterval(() => {
                    setQR('')
                    setDisabled(false)
                }, 1000)
            })
    }

    return (
        <div id="qr-page">
            <Container id="qr-container">
                <h2 id="qr-greeting">Good {greetings(Number(clock.substr(-8, 2)))}, have a nice day! </h2>
                <h2 id="qr-date">{clock.substr(0, (clock.length - 10))}</h2>
                <h1 id="qr-time">{clock.substr(-8, 8)}</h1>
                { QR ? <QRcode value={QR} size={300} /> : <Image src={HSQLogo} size="medium" /> }
                <br />
                <Button
                    id="qr-button"
                    disabled={disabled}
                    onClick={(event) => getQRcode(event)}
                    content="Get QR"
                />
            </Container>
        </div>
    )
}
