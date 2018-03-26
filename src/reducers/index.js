import { combineReducers } from "redux"
import positionReducer from "./positionReducer"
import secondReducer from "./secondReducer"
import usersReducer from "./usersReducer"
import userReducer from "./userReducer"
import informationsReducer from "./informationsReducer"
import reportsReducer from "./reportsReducer"

export default combineReducers({
    positionReducer,
    secondReducer,
    usersReducer,
    userReducer,
    informationsReducer,
    reportsReducer
})