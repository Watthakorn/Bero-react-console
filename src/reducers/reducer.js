import { combineReducers } from "redux"
import firstReducer from "./firstReducer"
import secondReducer from "./secondReducer"
import usersReducer from "./usersReducer"
import userReducer from "./userReducer"

const combileApp = combineReducers({
    firstReducer,
    secondReducer,
    usersReducer,
    userReducer
})

export default combileApp