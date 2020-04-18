const initialStatus = {
    name: '',
    password:'',
    email: '',
    birthDate: '',
    address: '',
    phoneNumber: '',
    role: '',
    authLevel: 0,
    superior: 0,
    paidLeave: 0,
    data: {},
    employees: [],
    loading: false,
    error: null
}

const reducers = (state = initialStatus, action) => {
    switch(action.type) {
        case "SET_EMPLOYEES" : 
            return {
                ...state,
                employees : action.payload
            }
        case "SET_LOADING" : 
            return {
                ...state,
                loading : action.payload
            }
        case "SET_ERROR" : 
            return {
                ...state,
                error : action.payload
            }
        case "SET_NAME" : 
            return {
                ...state,
                name : action.payload
            }
        default: 
            return state
    }
}

export default reducers