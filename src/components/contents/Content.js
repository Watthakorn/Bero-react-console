import React, { Component } from 'react';
import FirstPage from './FirstPage';
import Report from './Report';
import Informaiton from './Information';
import User from './User';
import Event from './Event';
import { Switch, Route, Redirect } from 'react-router-dom';
import fire, { auth } from "../../fire";
import { connect } from "react-redux"
import '../../css/bero.css';

class Content extends Component {
    render() {
        return (
            <div className="main-content col-8 col-sm-9 col-md-10 pt-3 px-4" id="main">

                <Switch>
                    <Route exact path='/' component={FirstPage} />
                    <PrivateRoute path='/report' component={Report} />
                    <PrivateRoute path='/information' component={Informaiton} />
                    <PrivateRoute path='/user' component={User} />
                    <PrivateRoute path='/event' component={Event} />
                </Switch>

            </div>
        );
    }
}

function isAdmin(user) {
    var type;
    if (user) {
        var userId = auth().currentUser.uid;
        // console.log(userId);
        fire.database().ref('/users/' + userId + '/Profile/type').on('value', function (snapshot) {
            type = snapshot.val();
        });
        // console.log(type);
        if (type === "Admin") {
            return true;
        } else {
            return false;
        }
    }
}


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        isAdmin(auth().currentUser)
            ? <Component {...props} />
            : <Redirect to='/' />
    )}>

    </Route>
)

// const mapStateToProps = (state) => {
//     return {
//         user: state.userReducer
//     }
// }

export default Content;
