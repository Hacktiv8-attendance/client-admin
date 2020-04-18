import React, { useState } from 'react'
import QRcode from 'qrcode.react'
import axios from 'axios'
import { Button, Image } from 'semantic-ui-react'
import HSQLogo from '../assets/HRQ.jpg'
import moment from 'moment'
import 'moment/locale/id'

import './QR.css'

export default function QR() {
    const [QR, setQR] = useState('');
    const [time, setTime] = useState('')
    const [disabled, setDisabled] = useState(false)

    setInterval(() => {
        setTime(moment(new Date()).format("dddd, MMMM Do YYYY, hh:mm:ss"))
    }, 1000)

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
                }, 10000)
            })
    }

    return (
        <div>
            <h1>ini QR</h1>
            <h2>{time}</h2>
            { QR ? <QRcode value={QR} /> : <Image src={HSQLogo} size="small" /> }
            <Button
                disabled={disabled}
                onClick={(event) => getQRcode(event)}
                content="Get QR"
            />
        </div>
    )
}
