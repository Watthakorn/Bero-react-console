import React, { Component } from 'react';
import { Link } from "react-router-dom";
import fire, { provider, auth } from "../fire";
import { connect } from "react-redux";
import '../css/bero.css';

class Sidebar extends Component {
    componentWillMount() {

        var thisState = this;
        if (this.props.user.user) {
            var userId = this.props.user.user.uid;
            fire.database().ref('/users/' + userId + '/Profile/type').on('value', function (snapshot) {
                thisState.props.typeAdmin(snapshot.val());
            });
        }

    }

    async loginFacebook() {
        var user = [];
        var thisState = this;
        if (auth().currentUser) {
            this.props.loginFace(auth().currentUser);

        } else {
            await auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // console.log("dwdwd");
                // ...

                // console.log(user.providerData[0].uid);
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
                console.log(errorMessage);

            });
            this.props.loginFace(auth().currentUser);

            var userId = this.props.user.user.uid;
            fire.database().ref('/users/' + userId + '/Profile/type').on('value', function (snapshot) {
                thisState.props.typeAdmin(snapshot.val());
            });
        }



    }


    logoutFacebook() {
        auth().signOut();
        this.props.logoutFace();
        window.location.reload();
    }

    render() {
        const user = this.props.user.user;

        let button = null;

        if (user) {
            button = <LogoutFacebook onClick={this.logoutFacebook.bind(this)} />
        } else {
            button = <LoginFacebook onClick={this.loginFacebook.bind(this)} />
        }

        return (
            <div className="col-4 col-sm-3 col-md-2 sidebar-fixed" >
                <div className="col-4 col-sm-3 col-md-2 bg-light sidebar" id="sticky-sidebar">

                    {/* <!-- Profile --> */}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex">
                                {/* <i className="fa fa-address-card-o" /> */}
                                <AlreadyLogin user={user} />
                                {/* {JSON.stringify(this.state.user)} */}
                            </div>
                            {button}
                            {/* {JSON.stringify(this.props.user.user)} */}
                        </div>
                    </div>
                    {user ? user.type === "Admin" ?
                        <div>
                            <ul className="navbar-nav flex-column">
                                {/* <!-- ADMIN Sidebar --> */}
                                <li className="menu-title">Admin</li>
                                <li className="nav-item btn-light">
                                    <Link className="nav-link" to="/report"><i className="fa fa-file-text-o"></i> Report</Link>
                                </li>
                                <li className="nav-item btn-light">
                                    <Link className="nav-link" to="/information"><i className="fa fa-building-o"></i> Infomation</Link>
                                </li>
                                <li className="nav-item btn-light">
                                    <Link className="nav-link" to="/user"><i className="fa fa-users"></i> User</Link>
                                </li>
                            </ul>

                            {/* <!-- EVENT Sidebar --> */}
                            <ul className="navbar-nav flex-column">
                                <li className="menu-title">Event</li>
                                <li className="nav-item btn-light">
                                    <Link className="nav-link" to="/event"><i className="fa fa-gears"></i> Manage</Link>
                                </li>
                                <li className="nav-item btn-light">
                                    <Link className="nav-link" to="/request"><i className="fa fa-child"></i> Request</Link>
                                </li>
                            </ul>
                        </div>
                        : '' : ''
                    }


                </div>
            </div>
        );
    }
}


function AlreadyLogin(props) {
    var user = props.user;
    if (user) {
        return (
            <div>
                <div className="row">
                    <div className="col-12 col-xl-6">
                        {user.providerData ?
                            <img src={"http://graph.facebook.com/" + user.providerData[0].uid + "/picture?type=square"}
                                style={{ "height": "75px", "width": "75px" }} className="border border-primary rounded" />
                            : ''}
                    </div>
                    <div className="col-12 col-xl-6  d-flex align-items-center">
                        <p style={{ "wordWrap": "break-word" }}>{user.displayName}</p>
                    </div>
                </div>
                <hr />
            </div>
        );

    } else {
        return (
            <div>
            </div>
        );
    }

}

function LoginFacebook(props) {
    return (
        <div className="row">
            <button type="button" onClick={props.onClick} className="btn btn-large btn-block btn-primary "><i className="fa fa-facebook-f" />| Login with Facebook</button>
        </div>
    )
}

function LogoutFacebook(props) {
    return (
        <div className="row">
            <button type="button" onClick={props.onClick} className="btn btn-large btn-block btn-danger ">Logout</button>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        user: state.userReducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        loginFace: (user) => {
            dispatch({
                type: "LOGIN_USER",
                payload: user
            })
        },
        logoutFace: (users) => {
            dispatch({
                type: "LOGOUT_USER"
            })
        },
        typeAdmin: (type) => {
            dispatch({
                type: "TYPE_ADMIN",
                payload: type
            })
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
