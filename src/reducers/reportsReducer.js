const INITIAL_STATE = {
    reports: null
}

const reports = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "REPORTS_FETCH":
            state = {
                ...state,
                reports: action.payload
            }
            break;
        default:
    }
    return state;
}

export default reports