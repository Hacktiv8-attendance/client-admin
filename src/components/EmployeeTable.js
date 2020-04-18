import React from 'react'
import { Table } from 'semantic-ui-react'
import moment from 'moment'

export default function EmployeeTable({ employee }) {
    return (
        <Table.Row>
            <Table.Cell> {employee.name} </Table.Cell>
            <Table.Cell> {employee.id} </Table.Cell>
            <Table.Cell> {employee.name} </Table.Cell>
            <Table.Cell> {employee.email} </Table.Cell>
            <Table.Cell> {employee.role} </Table.Cell>
            <Table.Cell> {employee.superior} </Table.Cell>
            <Table.Cell> {employee.authLevel} </Table.Cell>
            <Table.Cell> { moment(employee.birthDate).format('DD MMMM YYYY') } </Table.Cell>
            <Table.Cell> {employee.address} </Table.Cell>
            <Table.Cell> {employee.phoneNumber} </Table.Cell>
            <Table.Cell> {employee.paidLeave} </Table.Cell>
            <Table.Cell> Edit | Delete </Table.Cell>
        </Table.Row>
    )
}