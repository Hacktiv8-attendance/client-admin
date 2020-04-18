import React from 'react'
import { Image, Container } from 'semantic-ui-react'

import './NotFound.css'
import EmptyImage from '../assets/404.svg'

export default function NotFound() {
    return (
        <div id="notfound-page">
            <Container id="notfound-container">
                <Image onClick={() => console.log("testr")} src={EmptyImage} />
                <h1>Ooppss you came to wrong place, please go back :)</h1>
            </Container>
        </div>
    )
}
