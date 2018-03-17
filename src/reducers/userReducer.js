const userState = {
    user: null
}

const user = (state = userState, action) => {
    switch (action.type) {
        case "LOGIN_USER":
            state = {
                ...state,
                user: action.payload
            }
            break;
        case "LOGOUT_USER":
            state = {
                ...state,
                user: null
            }
            break;
        default:
    }
    return state;
}

export default user