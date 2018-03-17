import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { connect } from "react-redux";


// var usersRef = fire.database().ref('users');

// var allUser = [];

// usersRef.on('child_added', snap => {
//     let user = { id: snap.key, data: snap.val() }
//     allUser.push(user);
//     // console.log(snap.val());
// });

class User extends Component {

    componentWillMount() {
        var allUser = [];
        var usersRef = fire.database().ref('users');
        usersRef.on('child_added', snap => {
            let user = { id: snap.key, data: snap.val() }
            // this.setState({ users: [user].concat(this.state.users) });
            // console.log(snap.val());
            allUser.push(user);
        });

        this.props.addUsers(allUser);
        // console.log(allUser);
    }
    render() {

        const users = this.props.users.users;

        return (
            <div>
                <div className="d-flex justify-content-end">
                    <h1 className="page-title"><i className="fa fa-users"></i> User</h1>
                </div>
                <h2>Table user</h2>
                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>FacebookID</th>
                                <th>Picture</th>
                                <th>Name</th>
                                <th>Score</th>
                                <th>More</th>
                            </tr>
                        </thead>
                        <tbody>
                            <UserRows allUser={users} />
                        </tbody>
                    </table>
                </div>

                <UserModals allUser={users} />



            </div>
        );
    }
}

function UserRows(props) {
    var userrows = [];
    var allUser = props.allUser;
    if (allUser) {
        for (let index = 0; index < allUser.length; index++) {
            let user = allUser[index];
            userrows.push(<UserRow key={user.id} profile={user.data.Profile} target={"#" + user.id} displayName={user.data.Profile.displayName} />);
        }

    }
    return userrows;

}
function UserRow(props) {
    return (
        <tr>
            <td>{props.profile.facebookUid}</td>
            <td><img src={props.profile.profilePicture} /></td>
            <td>{props.profile.displayName}</td>
            <td>{props.profile.score}</td>
            <td><a href="#" className="btn btn-primary" data-toggle="modal" data-target={props.target}><i className="fa fa-info-circle"></i> detail</a></td>
        </tr>
    );

}

function UserModals(props) {
    var usermodals = [];
    var allUser = props.allUser;
    if (allUser) {
        for (let index = 0; index < allUser.length; index++) {
            let user = allUser[index];
            usermodals.push(<UserModal key={user.id} profile={user.data.Profile} target={user.id} />);
        }
    }
    return usermodals;

}
function UserModal(props) {
    return (
        <div className="modal fade" id={props.target} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">User: {props.profile.facebookUid}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="col-12"><img src={props.profile.profilePicture} /></div>
                        <div className="col-12">Name: {props.profile.displayName}</div>
                        <div className="col-12">Score: {props.profile.score}</div>
                        <div className="col-12">Skill: {props.profile.skill}</div>
                        <div className="col-12 row">
                            <div className="col-6">Current Request: {props.profile.requestCreate}</div>
                            <div className="col-6">Status: {props.profile.statusCreate}</div>
                        </div>

                        <div className="col-12 row">
                            <div className="col-6">Response Request: {props.profile.requestAccepted}</div>
                            <div className="col-6">Status: {props.profile.statusRequest}</div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );

}


const mapStateToProps = (state) => {
    return {
        users: state.usersReducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
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



export default connect(mapStateToProps, mapDispatchToProps)(User);
