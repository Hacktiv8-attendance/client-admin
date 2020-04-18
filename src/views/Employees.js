import React, { useEffect } from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { fetchEmployees } from '../store/actions'

export default function Employees() {
    const dispatch = useDispatch()
    const employees = useSelector(state => state.reducers.employees)
    const error = useSelector(state => state.reducers.error)
    const loading = useSelector(state => state.reducers.loading)
    
    useEffect(() => {
        dispatch(fetchEmployees())
    }, [])

    return (
        <div>
            <h1>Ini Employees</h1>
        </div>
    )
}


