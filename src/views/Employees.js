import React, { useEffect } from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { fetchEmployees } from '../store/actions'
import { Form, Button } from 'react-bootstrap'

export default function Employees() {
    const dispatch = useDispatch()
    const employees = useSelector(state => state.reducers.employees)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [role, setRole] = useState('')
    const [authLevel, setAuthLevel] = useState('')
    const [superior, setSuperior] = useState('')
    const [paidLeave, setPaidLeave] = useState('')
    

    useEffect(() => {
        dispatch(fetchEmployees())
    }, [])

    return (
        <div>
            <Form className="container" onSubmit={(event) => submitForm(event)}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Title" onChange={(event) => changeTitle(event)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Overview</Form.Label>
                    <Form.Control type="text" placeholder="Overview" onChange={(event) => changeOverview(event)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Poster</Form.Label>
                    <Form.Control type="text" placeholder="Poster" onChange={(event) => changePosterPath(event)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Popularity</Form.Label>
                    <Form.Control type="number" placeholder="Popularity" onChange={(event) => changePopularity(event)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Tags</Form.Label>
                    <Form.Control type="text" placeholder="Tags" onChange={(event) => changeTags(event)}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <h1>Ini Employees</h1>
        </div>
    )
}
