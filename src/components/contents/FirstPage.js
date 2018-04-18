import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { compose, withProps, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { connect } from "react-redux"


class FirstPage extends Component {


    componentWillMount() {

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
        user: state.usersReducer
    }
}
export default connect(mapStateToProps)(FirstPage);
