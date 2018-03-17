import { combineReducers } from "redux"
import firstReducer from "./firstReducer"
import secondReducer from "./secondReducer"
import usersReducer from "./usersReducer"
import userReducer from "./userReducer"

export default combineReducers({
    firstReducer,
    secondReducer,
    usersReducer,
    userReducer
})