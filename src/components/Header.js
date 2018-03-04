import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Header extends Component {
    render() {
        return (
            <div className="container-fluid fixed-top">
                <div className="row">
                    <div className="navbar col-4 col-sm-3  col-md-2 navbar-light bg-info">
                        <Link id="beroConsole" className="navbar-brand text-light" to="/">Bero console</Link>
                    </div>

                    <div className="navbar col-2 col-sm-2 col-md-3 top-title bg-light">
                        <a id="topTitle" className="navbar-brand text-dark" href="#">Top title/Tools</a>
                    </div>

                    <div className="nav col-6 col-sm-7 col-md-7 top-title bg-light d-flex justify-content-end">
                        <div className="d-flex align-items-center">
                            <div className="col-9">
                                <div className="input-group">
                                    <input className="form-control" placeholder="search..." />
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="btn-group">
                                    <button className="btn btn-outline-dark btn-sm dropdown-toggle" data-toggle="dropdown"><i className="fa fa-bell"></i></button>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <button className="dropdown-item" type="button"><i className="fa fa-user"></i>Notification</button>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item" type="button"><i className="fa fa-user"></i>Another Notification</button>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item" type="button"><i className="fa fa-user"></i>Something else here</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Header;
