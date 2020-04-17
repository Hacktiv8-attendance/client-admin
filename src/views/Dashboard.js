import React from 'react'
import { Button } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'

export default function Dashboard() {
    const history = useHistory()
    
    const logout = (event) => {
        event.preventDefault()
        history.replace('/')
        localStorage.clear()
    }
    
    return (
        <div>
            <h1>ini dashboard</h1>
            <Button
                onClick={(event) => logout(event)}
                content="Logout"
            />
        </div>
    )
}
