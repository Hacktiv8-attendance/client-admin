const initialStatus = {
    employees: [],
    loading: false,
    error: null,
    absence: []
}

const reducers = (state = initialStatus, action) => {
    switch(action.type) {
        case "SET_EMPLOYEES" : 
            return {
                ...state,
                employees : action.payload
            }
        case "SET_ABSENCE" : 
            return {
                ...state,
                absence : action.payload
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
            return {
                ...state,
                employees: [...state.employees, action.payload]
            }
        case "UPDATE_EMPLOYEE" :
            const employees = [...state.employees]
            const found = employees.findIndex(el => el.id === action.payload.id)
            employees[found] = action.payload
            return {
                ...state,
                employees: employees
            }
        case "DELETE_EMPLOYEE" :
            const temp = [...state.employees]
            const deleted = temp.findIndex(el => el.id === action.payload.id)
            temp.splice(deleted, 1)
            return {
                ...state,
                employees: temp
            }
        default: 
            return state
    }
}


export default reducers

