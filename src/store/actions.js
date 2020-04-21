import axios from 'axios'
import { NotificationManager } from 'react-notifications'
const serverUrl = 'http://18.138.253.176'

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

export const setAbsence = (value) => {
    return {
        type: "SET_ABSENCE",
        payload: value
    }
}

export const setMessages = (value) => {
    return {
        type: "SET_MESSAGES",
        payload: value
    }
}

export const fetchAbsence = (payload) => (dispatch) => {
    dispatch(setLoading(true))
    axios({
        method: 'get',
        url: `${serverUrl}/admin/absence`,
        params: {
            month: payload.month,
            SuperiorId: payload.SuperiorId
        },
        headers: {
            token: localStorage.token
        }
    })
    .then(({ data }) => {
        dispatch(setAbsence(data))
    })
    .catch(err => {
        setError(err)
    })
    .finally(() => {
        dispatch(setLoading(false))
    })
}

export const fetchEmployees = (payload) => {
    return function(dispatch) {
        dispatch(setLoading(true))
        axios({
            method: 'get',
            url: `${serverUrl}/admin/employee`,
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
            url: `${serverUrl}/admin/employee`,
            data: payload,
            headers: {
                token: localStorage.token
            }
        })
        .then(({ data }) => {
            dispatch({
                type: "ADD_EMPLOYEE",
                payload: {...payload, id: data.id}
            })
        })
        .catch( err => {
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
            url: `${serverUrl}/admin/employee/${payload}`,
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .then(({data}) => {
            dispatch({type: "DELETE_EMPLOYEE", payload: data})
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
            url: `${serverUrl}/admin/employee/${payload.id}`,
            data: payload,
            headers: {
                token : localStorage.getItem('token')
            }
        })
        .then(({ data }) => {
            dispatch({ type: "UPDATE_EMPLOYEE", payload: data})
        })
        .catch(err => {
            dispatch(setError('Update Employee Failed'))
        })
        .finally(() => {
            dispatch(setLoading(false))
        })
    }
}

export const fetchMessages = (value) => {
    return function (dispatch) {
        dispatch(setLoading(true))
        axios({
            method: "GET",
            url: `${serverUrl}/admin/message`,
            headers: {
                token: localStorage.getItem('token')
            }
        })
            .then(({ data }) => {
                dispatch({
                    type: "SET_MESSAGES",
                    payload: data
                })
            })
            .catch(err => {
                dispatch(setError(err))
            }) 
            .finally(() => {
                dispatch(setLoading(false))
            })
    }
}

export const broadcastMessage = (payload) => {
    return function (dispatch) {
        dispatch(setLoading(true))
        axios({
            method: "POST",
            url: `${serverUrl}/admin/message`,
            data: payload,
            headers: {
                token: localStorage.token
            }
        })
        .then(({ data }) => {
            dispatch({
                type: "ADD_MESSAGE",
                payload: data
            })
            NotificationManager.success(payload.message, "BROADCASTED!")
            return data
        })
        .catch(err => {
            dispatch(setError('Failed to broadcast message'))
        })
        .finally(() => {
            dispatch(setLoading(false))
        })
    }
}
