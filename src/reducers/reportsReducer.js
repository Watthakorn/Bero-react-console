const INITIAL_STATE = {
    reports: null
}

const reports = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // case "USERS_PROFILE_UPDATE":
        //     state = {
        //         ...state,
        //         users: state.users
        //     }
        //     break;
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