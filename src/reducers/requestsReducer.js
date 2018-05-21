const INITIAL_STATE = {
    requests: null
}

const requests = (state = INITIAL_STATE, action) => {
    switch (action.type) {
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