import React, { Component } from 'react';
// import fire from '../../fire';
import '../../css/bero.css';
import { connect } from "react-redux"


class FirstPage extends Component {


    componentWillMount() {

    }

    render() {
        const user = this.props.user.user;

        return (
            <div>
                {user ? user.type === "Admin"
                    ? <h1>Welcome! {user.displayName}</h1>
                    : <h1>Permission denied! You're not Admin.</h1>
                    : <h1>You're not login.</h1>
                }
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        user: state.userReducer
    }
}
export default connect(mapStateToProps)(FirstPage);
