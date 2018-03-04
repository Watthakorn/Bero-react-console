const secondState = {
    result2: 15000,
    value2: []
}

const secondReducer = (state = secondState, action) => {
    switch (action.type) {
        case "RESET":
            state = {
                ...state,
                result2: state.result2 = 15000
            }
            break;
        case "ZERO":
            state = {
                ...state,
                result2: state.result2 = 0
            }
            break;
        default:
    }
    return state;
}

export default secondReducer