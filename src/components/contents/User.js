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

    constructor(props) {
        super(props);
        this.state = {
            pagenumber: 1,
            itemperpage: 10
        };
    }

    componentWillMount() {
        var allUser = [];
        var usersRef = fire.database().ref('users');
        usersRef.on('child_added', snap => {
            let user = { id: snap.key, data: snap.val() }
            // this.setState({ users: [user].concat(this.state.users) });
            // console.log(snap.val());
            allUser.push(user);
        });
        usersRef.on('child_changed', snap => {
            let user = { id: snap.key, data: snap.val() }
            for (let i in allUser) {
                if (allUser[i].id === user.id) {
                    allUser[i].data = user.data;
                    break;
                }
            }
            this.props.addUsers(allUser);
        });
        usersRef.on('child_removed', snap => {
            let remove = snap.key;
            for (let i in allUser) {
                if (allUser[i].id === remove) {
                    allUser.splice(i, 1)
                    break;
                }
            }
            this.props.addUsers(allUser);
        });

        this.props.addUsers(allUser);
        // console.log(allUser);
    }

    _handleSaveChange(e) {
        e.preventDefault();
        // var userId = e.target.value;
        // console.log(e.target.score.value);
        fire.database().ref('users/' + e.target.id + '/Profile').update({
            point: +e.target.score.value,
        });
        // this.props.updateUser(e.target.id, e.target.score.value);
        // console.log("hey wake up!");
        e.target.score.disabled = "disabled";
        e.target.submitBtn.disabled = "disabled";
    }

    _handlePagination(e) {
        e.preventDefault();
        this.setState({
            pagenumber: e.target.value,
        })
        // console.log(e.target.value)
    }


    _handleUpgradeToAdmin(e) {
        e.preventDefault();
        if (window.confirm("Are you sure?")) {
            fire.database().ref('users/' + e.target.value + '/Profile').update({
                type: "Admin",
            });
        }
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
                <ul className="pagination">
                    <Page page={Math.ceil(users.length / this.state.itemperpage)} pagenumber={this.state.pagenumber} onClick={(e) => this._handlePagination(e)} />
                </ul>
                <h2>Table user</h2>
                <div className="table-responsive">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr>
                                <th>FacebookID</th>
                                <th>Picture</th>
                                <th>Name</th>
                                <th>Point</th>
                                <th>More</th>
                            </tr>
                        </thead>
                        <tbody>
                            <UserRows allUser={users} pagenumber={this.state.pagenumber} itemperpage={this.state.itemperpage} />
                        </tbody>
                    </table>
                </div>

                <UserModals allUser={users} onSubmit={(e) => this._handleSaveChange(e)}
                    onClick={(e) => this._handleUpgradeToAdmin(e)}
                    pagenumber={this.state.pagenumber} itemperpage={this.state.itemperpage} />



            </div>
        );
    }
}


function Page(props) {
    var pages = [];
    if (props.page) {
        for (let index = 0; index < props.page; index++) {
            pages.push(<li key={index} className="page-item"><button onClick={props.onClick}
                className="page-link" value={index + 1}>{index + 1}</button></li>)
        }
    }

    return pages;
}

function UserRows(props) {
    var userrows = [];
    var allUser = props.allUser;
    allUser.sort(function (a, b) { return (a.data.Profile.facebookUid > b.data.Profile.facebookUid) ? 1 : ((b.data.Profile.facebookUid > a.data.Profile.facebookUid) ? -1 : 0); });

    var itemperpage = props.itemperpage;
    var userlength = allUser.length;
    var page = props.pagenumber;
    var lastpage = Math.ceil(userlength / itemperpage);

    if (allUser) {
        if (page >= lastpage && userlength % itemperpage !== 0) {
            for (let index = 0; index < userlength % itemperpage; index++) {
                let user = allUser[index + (itemperpage * (page - 1))];
                userrows.push(<UserRow key={user.id} user={user} profile={user.data.Profile} target={"#" + user.id} displayName={user.data.Profile.displayName} />);
            }
        } else {
            for (let index = 0; index < itemperpage; index++) {
                let user = allUser[index + (itemperpage * (page - 1))];
                if (user) {
                    userrows.push(<UserRow key={user.id} user={user} profile={user.data.Profile} target={"#" + user.id} displayName={user.data.Profile.displayName} />);
                }
            }
        }
        // for (let index = 0; index < allUser.length; index++) {
        //     let user = allUser[index];
        //     userrows.push(<UserRow key={user.id} user={user} profile={user.data.Profile} target={"#" + user.id} displayName={user.data.Profile.displayName} />);
        // }
    }
    return userrows;

}
function UserRow(props) {
    return (
        <tr>
            <td>{props.profile.facebookUid}</td>
            <td><img alt="profilePic" className="border border-primary rounded" src={props.profile.profilePicture} style={{ width: "75px", height: "75px" }} /></td>
            <td>{props.profile.displayName}</td>
            <td>{props.profile.point ? props.profile.point : '0'}</td>
            <td><a href="" className="btn btn-primary" data-toggle="modal" data-target={props.target}><i className="fa fa-info-circle"></i> detail</a></td>
        </tr>
    );

}

function UserModals(props) {
    var usermodals = [];
    var allUser = props.allUser;

    var itemperpage = props.itemperpage;
    var userlength = allUser.length;
    var page = props.pagenumber;
    var lastpage = Math.ceil(userlength / itemperpage);

    if (allUser) {
        if (page >= lastpage && userlength % itemperpage !== 0) {
            for (let index = 0; index < userlength % itemperpage; index++) {
                let user = allUser[index + (itemperpage * (page - 1))];
                if (user) {
                    usermodals.push(<UserModal key={user.id} user={user} profile={user.data.Profile} target={user.id}
                        onSubmit={props.onSubmit} onClick={props.onClick} />);
                }
            }
        } else {
            for (let index = 0; index < itemperpage; index++) {
                let user = allUser[index + (itemperpage * (page - 1))];
                if (user) {
                    usermodals.push(<UserModal key={user.id} user={user} profile={user.data.Profile} target={user.id}
                        onSubmit={props.onSubmit} onClick={props.onClick} />);
                }
            }
        }

        // for (let index = 0; index < allUser.length; index++) {
        //     let user = allUser[index];
        //     usermodals.push(<UserModal key={user.id} user={user} profile={user.data.Profile} target={user.id} onSubmit={props.onSubmit} />);
        // }
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
                                {/* <div className="col-md-4 col-lg-2">
                                    <img className="border border-primary rounded" src={props.profile.profilePicture} style={{ width: "75px", height: "75px" }} />
                                </div>
                                <div className="col-md-8 col-lg-10">
                                    <br />
                                    <div className="col-12">Name: {props.profile.displayName}</div>
                                    <div className="col-12">Skill: {props.profile.skill}</div>
                                </div> */}
                                <div className="col-2">
                                    <div className="col-12">
                                        <img alt="profilePic" src={props.profile.profilePicture} style={{ "height": "75px", "width": "75px" }} className="border border-primary rounded" />
                                    </div>
                                </div>
                                <div className="col-10 container-fluid d-flex align-content-around flex-wrap">
                                    <div className="col-12">
                                        <p style={{ "wordWrap": "break-word" }}>Name: {props.profile.displayName}</p>
                                    </div>
                                    <div className="col-12 font-weight-light mt-auto">
                                        Skill: {(props.profile.skills).join(",")}
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="col-12 row d-flex align-items-center">
                                <div className="col-6">Lastest Request</div>
                                <div className="col-6">{props.profile.requestCreate}</div>
                                {/* <div className="col-6">Status: {props.profile.statusCreate}</div> */}
                            </div>
                            <hr />
                            <div className="col-12 row d-flex align-items-center">
                                <div className="col-6"> Lastest Response</div>
                                <div className="col-6">{props.profile.requestAccepted}</div>
                                {/* <div className="col-6">Status: {props.profile.statusRequest}</div> */}
                            </div>


                            <hr />
                            <div className="col-12 row">
                                <div className="col-6 d-flex align-items-center">
                                    <div>
                                        CurrentPoint : {props.profile.point}
                                    </div>

                                </div>
                                <div className="col-6 d-flex align-items-center">

                                    ChangePoint
                                <input type="number"
                                        className="form-control"
                                        name="score"
                                        style={{ marginLeft: "10px" }}
                                        defaultValue={props.profile.point}
                                        disabled=""
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer d-flex">
                            {props.profile.type === "Admin" ? '' :
                                <button value={props.user.id} onClick={props.onClick} className="mr-auto btn btn-danger" disabled="">Upgrade To Admin</button>
                            }
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
        user: state.userReducer
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
