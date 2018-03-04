const firstState = {
    result: 15000,
    value: []
}

const firstReducer = (state = firstState, action) => {
    switch (action.type) {
        case "ADD":
            state = {
                ...state,
                result: state.result += action.payload
            }
            break;
        case "SUB":
            state = {
                ...state,
                result: state.result -= action.payload
            }
            break;
        default:
    }
    return state;
}

export default firstReducer