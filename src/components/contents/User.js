import React, { Component } from 'react';
import '../../css/bero.css';

class User extends Component {
    render() {
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <h1 className="page-title"><i className="fa fa-users"></i> User</h1>
                </div>
                <div w3-include-html="table-user.html"></div>
            </div>
        );
    }
}


export default User;
