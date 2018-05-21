const INITIAL_STATE = {
    users: null
}

const users = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "USERS_PROFILE_FETCH":
            state = {
                ...state,
                users: action.payload
            }
            break;
        default:
    }
    return state;
}

export default users