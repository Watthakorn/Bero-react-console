const INITIAL_STATE = {
    events: null
}

const events = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // case "USERS_PROFILE_UPDATE":
        //     state = {
        //         ...state,
        //         users: state.users
        //     }
        //     break;
        case "EVENTS_FETCH":
            state = {
                ...state,
                events: action.payload
            }
            break;
        default:
    }
    return state;
}

export default events