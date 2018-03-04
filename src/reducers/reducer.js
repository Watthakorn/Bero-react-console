import { combineReducers } from "redux"
import firstReducer from "./firstReducer"
import secondReducer from "./secondReducer"

const combileApp = combineReducers({
    firstReducer,
    secondReducer
})

export default combileApp