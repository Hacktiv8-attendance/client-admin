import React, { useEffect } from 'react'

import './Dashboard.css'
import { useHistory } from 'react-router-dom'

export default function Dashboard() {
    const history = useHistory()
    useEffect(() => {
        if(localStorage.getItem('qr')) {
            history.replace('/qr')
        }
    }, [history])
    return (
        <div id="dashboard-page">
            <div id="dashboard-display">
                <h1>Ini Dashboard</h1>
            </div>
        </div>
    )
}
