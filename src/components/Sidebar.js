import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { provider, auth } from "../fire";
import { connect } from "react-redux";
import '../css/bero.css';


class Sidebar extends Component {

    async loginFacebook() {
        const result = await auth().signInWithPopup(provider)
        this.props.loginFace(result.user);
    }


    logoutFacebook() {
        auth().signOut()
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
                            <Link className="nav-link" to="Event"><i className="fa fa-gears"></i> Manage</Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

function AlreadyLogin(props) {
    var user = props.user;
    if (user) {
        return (
            <div className="row">
                <div className="col-6">
                    <img src={user.photoURL} />
                </div>
                <div className="col-6">
                    {user.displayName}
                </div>
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
            <button type="button" onClick={props.onClick} className="btn btn-large btn-block btn-primary ">Login</button>
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
        loginFace: (users) => {
            dispatch({
                type: "LOGIN_USER",
                payload: users
            })
        },
        logoutFace: (users) => {
            dispatch({
                type: "LOGOUT_USER"
            })
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
