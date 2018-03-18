import { combineReducers } from "redux"
import positionReducer from "./positionReducer"
import secondReducer from "./secondReducer"
import usersReducer from "./usersReducer"
import userReducer from "./userReducer"

export default combineReducers({
    positionReducer,
    secondReducer,
    usersReducer,
    userReducer
})