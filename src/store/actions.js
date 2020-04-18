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

export const fetchEmployees = (value) => {
    console.log(localStorage.token)
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
            console.log('ke hit kesini')
            if(data){
                dispatch(setEmployees(data))
                // console.log(data)
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