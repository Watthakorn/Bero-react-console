import { combineReducers } from "redux"
import positionReducer from "./positionReducer"
import secondReducer from "./secondReducer"
import usersReducer from "./usersReducer"
import userReducer from "./userReducer"
import informationsReducer from "./informationsReducer"
import reportsReducer from "./reportsReducer"
import eventsReducer from "./eventsReducer"
import requestsReducer from "./requestsReducer"

export default combineReducers({
    positionReducer,
    secondReducer,
    usersReducer,
    userReducer,
    informationsReducer,
    reportsReducer,
    eventsReducer,
    requestsReducer
})