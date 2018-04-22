import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
// import { createStore } from "redux";
import { Provider } from "react-redux";

// import reducer from "./reducers";
import { BrowserRouter } from 'react-router-dom';
import configureStore from './store'
import { PersistGate } from 'redux-persist/integration/react'

const { store, persistor } = configureStore()
// const store = createStore(reducer);


ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
