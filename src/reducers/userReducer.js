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
        case "TYPE_ADMIN":
            state = {
                ...state,
                user: {
                    ...state.user,
                    type: action.payload
                }
            }
            break;
        case "LOGOUT_USER":
            state = {
                user: null
            }
            break;
        default:
    }
    return state;
}

export default user