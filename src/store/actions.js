import axios from 'axios'

export const setLoading = (value) => {
    return {
        type: "SET_LOADING",
        payload: value
    }
}

export const setError = (value) => {
    return {
        type: "SET_ERROR",
        payload: value
    }
}

export const setEmployees = (value) => {
    return {
        type: "SET_EMPLOYEES",
        payload: value
    }
}


export const fetchEmployees = (payload) => {
    return function(dispatch) {
        dispatch(setLoading(true))
        axios({
            method: 'get',
            url: 'http://localhost:3000/admin/employee',
            headers: {
                token: localStorage.token
            }
        })
        .then(({ data }) => {
            if(data){
                dispatch(setEmployees(data))
            } else {
                dispatch(setError('Data employees is not found'))
            }
        })
        .catch(err => {
            dispatch(setError(err))
        })
        .finally(() => {
            dispatch(setLoading(false))
        })
    }
}

export const createEmployee = (payload) => {
    return function(dispatch) {
        dispatch(setLoading(true))
        axios({
            method: 'post',
            url: 'http://localhost:3000/admin/employee',
            data: payload,
            headers: {
                token: localStorage.token
            }
        })
        .then(({ data }) => {
            dispatch({
                type: "ADD_EMPLOYEE",
                payload
            })
        })
        .catch( err => {
            console.log(err)
            dispatch(setError('Failed create data new employee'))
        })
        .finally(() => {
            dispatch(setLoading(false))
        })
    }
}

export const deleteEmployee = (payload) => {
    return function(dispatch) {
        dispatch(setLoading(true))
        axios({
            method: 'delete',
            url: `http://localhost:3000/admin/employee/${payload}`,
            headers: {
                token: localStorage.token
            }
        })
        .then(() => {
            dispatch(fetchEmployees())
        })
        .catch(() => {
            dispatch(setError('Delete employee failed'))
        })
        .finally(() => {
            dispatch(setLoading(false))
        })
    }
}


export const updateEmployee = (payload) => {
    return function(dispatch) {
        dispatch(setLoading(true))
        axios({
            method: 'put',
            url: `http://localhost:3000/admin/employee/${payload.id}`,
            data: payload,
            headers: {
                token : localStorage.token
            }
        })
        .then(({ data }) => {
            console.log(data)
            dispatch(fetchEmployees())
        })
        .catch(err => {
            console.log(err)
            dispatch(setError('Update Employee Failed'))
        })
        .finally(() => {
            dispatch(setLoading(false))
        })
    }
}