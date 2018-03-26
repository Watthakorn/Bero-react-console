const INITIAL_STATE = {
    informations: null
}

const informations = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // case "USERS_PROFILE_UPDATE":
        //     state = {
        //         ...state,
        //         users: state.users
        //     }
        //     break;
        case "INFORMATIONS_FETCH":
            state = {
                ...state,
                informations: action.payload
            }
            break;
        default:
    }
    return state;
}

export default informations