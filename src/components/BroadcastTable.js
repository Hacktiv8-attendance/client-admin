import React from 'react'
import { Table } from 'semantic-ui-react'
import moment from 'moment'

export default function BroadcastTable({ message }) {
    return (
        <Table.Row>
            <Table.Cell width={2}> {moment(moment.createdAt).format('ll')} </Table.Cell>
            <Table.Cell width={8}> {message.message} </Table.Cell>
        </Table.Row>
    )
}
