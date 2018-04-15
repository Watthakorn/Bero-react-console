import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { connect } from "react-redux";


// var allUser = [];
// var usersRef = fire.database().ref('users');
// usersRef.on('child_added', snap => {
//     let user = { id: snap.key, data: snap.val() }
//     // this.setState({ users: [user].concat(this.state.users) });
//     // console.log(snap.val());
//     allUser.push(user);
// });

class User extends Component {

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
        // console.log(allUser);
    }

    _handleSaveChange(e) {
        e.preventDefault();
        // var userId = e.target.value;
        console.log(e.target.id);
        fire.database().ref('users/' + e.target.id + '/Profile').update({
            score: e.target.score.value,
        });
        // this.props.updateUser(e.target.id, e.target.score.value);
        // console.log("hey wake up!");
        e.target.score.disabled = "disabled";
        e.target.submitBtn.disabled = "disabled";
    }


    render() {

        const props = this.props;
        const users = props.users.users;
        // console.log(users);
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

                <UserModals allUser={users} onSubmit={(e) => this._handleSaveChange(e)} />



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
            userrows.push(<UserRow key={user.id} user={user} profile={user.data.Profile} target={"#" + user.id} displayName={user.data.Profile.displayName} />);
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
            <td><a href="" className="btn btn-primary" data-toggle="modal" data-target={props.target}><i className="fa fa-info-circle"></i> detail</a></td>
        </tr>
    );

}

function UserModals(props) {
    var usermodals = [];
    var allUser = props.allUser;
    if (allUser) {
        for (let index = 0; index < allUser.length; index++) {
            let user = allUser[index];
            usermodals.push(<UserModal key={user.id} user={user} profile={user.data.Profile} target={user.id} onSubmit={props.onSubmit} />);
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

                    <form id={props.user.id} onSubmit={props.onSubmit}>
                        <div className="modal-body">
                            <div className="row col-12">
                                <div className="col-md-4 col-lg-2"><img src={props.profile.profilePicture} /></div>
                                <div className="col-md-8 col-lg-10">
                                    <br />
                                    <div className="col-12">Name: {props.profile.displayName}</div>
                                    <div className="col-12">Skill: {props.profile.skill}</div>
                                </div>
                            </div>
                            <br />
                            <div className="col-12 row d-flex align-items-center">
                                <div className="col-6">Current Request: {props.profile.requestCreate}</div>
                                <div className="col-6">Status: {props.profile.statusCreate}</div>
                            </div>

                            <div className="col-12 row d-flex align-items-center">
                                <div className="col-6">Response Request: {props.profile.requestAccepted}</div>
                                <div className="col-6">Status: {props.profile.statusRequest}</div>
                            </div>


                            <br />
                            <div className="col-12 row">
                                <div className="col-6 d-flex align-items-center">
                                    <div>
                                        CurrentScore : {props.profile.score}
                                    </div>

                                    {/* <div className="col-1">±</div>
                                <div className="col-8 col-md-6">

                                    <input type="number"
                                        className="form-control"
                                        name="score"
                                    />
                                </div> */}

                                </div>
                                <div className="col-6 d-flex align-items-center">

                                    ChangeScore_
                                <input type="number"
                                        className="form-control"
                                        name="score"
                                        defaultValue={props.profile.score}
                                        disabled=""
                                    />
                                    {/* UserStatus :
                                {true
                                    ? <button type="button" className="btn btn-success">normal</button>
                                    : <button type="button" className="btn btn-danger">ban</button>
                                } */}
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" name="submitBtn" value={props.user.id} className="btn btn-primary" disabled="">Save changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );

}


const mapStateToProps = (state) => {
    return {
        users: state.usersReducer,
        reports: state.reportsReducer,
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
        },
        addReport: (reports) => {
            if (reports) {
                dispatch({
                    type: "REPORTS_FETCH",
                    payload: reports
                })
            }
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(User);
