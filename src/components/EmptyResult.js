import React from 'react'
import { Image, Table } from 'semantic-ui-react'

import EmptyImage from '../assets/EmptyResult.svg'

export default function EmptyResult() {
    return (
        <Table.Row>
            <Table.HeaderCell colSpan="16">
                <div className="employees-empty-container">
                    <h1>No Employee Shown</h1>
                    <Image src={EmptyImage} size="big" />
                </div>
            </Table.HeaderCell>
        </Table.Row>
    )
}
