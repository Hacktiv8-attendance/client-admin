import React from 'react'
import { Table } from 'semantic-ui-react'
import moment from 'moment'
import _ from 'lodash'

export default function BroadcastTable({ message }) {
    return (
        <Table.Row>
            <Table.Cell width={2}> {moment(moment.createdAt).format('ll')} </Table.Cell>
            <Table.Cell width={4}> {_.get(message, 'title')} </Table.Cell>
            <Table.Cell width={8}> {message.message} </Table.Cell>
        </Table.Row>
    )
}
