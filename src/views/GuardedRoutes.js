import React from 'react'
import { useHistory, Switch, Route } from 'react-router-dom'
import { NotificationContainer } from 'react-notifications'
import 'react-notifications/lib/notifications.css';
import './Dashboard.css'

import Dashboard from './Dashboard'
import Employees from './Employees'
import NotFound from './NotFound'
import TopMenu from '../components/TopMenu'
import Qr from '../components/QR'

export default function GuardedRoutes() {
    const history = useHistory()
    const token = localStorage.getItem('token')

    if(!token) {
        history.replace('/')
    }

    return (
        <div className="guarded-routes"> 
            <NotificationContainer />
            <TopMenu />
            <Switch>
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/employees" component={Employees} />
                <Route exact path="/qr" component={Qr} />
                <Route path="*" component={NotFound} />
            </Switch>
        </div>
    )
}
