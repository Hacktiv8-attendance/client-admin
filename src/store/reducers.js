const initialStatus = {
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
        case "ADD_EMPLOYEE" :
            console.log(action.payload)
            return {
                ...state,
                employees: [...state.employees, action.payload]
            }
        default: 
            return state
    }
}


export default reducers

