import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { compose, withProps, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { connect } from "react-redux"


class FirstPage extends Component {


    componentWillMount() {
        var allReport = [];
        var reportsRef = fire.database().ref('reports');
        reportsRef.on('child_added', snap => {
            let report = { id: snap.key, data: snap.val() }
            // this.setState({ users: [user].concat(this.state.users) });
            // console.log(snap.val());
            allReport.push(report);
        });
        var allUser = [];
        var usersRef = fire.database().ref('users');
        usersRef.on('child_added', snap => {
            let user = { id: snap.key, data: snap.val() }
            // this.setState({ users: [user].concat(this.state.users) });
            // console.log(snap.val());
            allUser.push(user);
        });

        this.props.addUsers(allUser);
        this.props.addReport(allReport);

    }

    render() {
        return (
            <div>

            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        reports: state.reportsReducer,
        users: state.usersReducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        addReport: (reports) => {
            if (reports) {
                dispatch({
                    type: "REPORTS_FETCH",
                    payload: reports
                })
            }
        },
        addUsers: (users) => {
            if (users) {
                dispatch({
                    type: "USERS_PROFILE_FETCH",
                    payload: users
                })
            }
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FirstPage);
