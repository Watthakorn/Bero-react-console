const INITIAL_STATE = {
    requests: null
}

const requests = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // case "USERS_PROFILE_UPDATE":
        //     state = {
        //         ...state,
        //         users: state.users
        //     }
        //     break;
        case "REQUESTS_FETCH":
            state = {
                ...state,
                requests: action.payload
            }
            break;
        default:
    }
    return state;
}

export default requests