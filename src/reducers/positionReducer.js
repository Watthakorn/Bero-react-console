const locationState = {
    lat: 13.7309425,
    lng: 100.7809674
}

const positionReducer = (state = locationState, action) => {
    switch (action.type) {
        case "CHANGE_LOCATION":
            state = {
                ...state,
                lat: action.payload.lat,
                lng: action.payload.lng
            }
            break;
        // case "SUB":
        //     state = {
        //         ...state,
        //         result: state.result -= action.payload
        //     }
        //     break;
        default:
    }
    return state;
}

export default positionReducer