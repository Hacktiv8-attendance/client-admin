import React, { useEffect } from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { fetchEmployees } from '../store/actions'

export default function Employees() {
    const dispatch = useDispatch()
    const employees = useSelector(state => state.reducers.employees)
    // const [name, setName] = useState('')
    // const [email, setEmail] = useState('')
    // const [password, setPassword] = useState('')
    // const [birthDate, setBirthDate] = useState('')
    // const [address, setAddress] = useState('')
    // const [phoneNumber, setPhoneNumber] = useState('')
    // const [role, setRole] = useState('')
    // const [authLevel, setAuthLevel] = useState('')
    // const [superior, setSuperior] = useState('')
    // const [paidLeave, setPaidLeave] = useState('')
    

    useEffect(() => {
        dispatch(fetchEmployees())
    }, [])

    return (
        <div>
            <h1>Ini Employees</h1>
        </div>
    )
}
