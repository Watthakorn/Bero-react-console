import React, { Component } from 'react';
import '../../css/bero.css';

class Information extends Component {
    render() {
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <h1 className="page-title"><i className="fa fa-building-o"></i> Information</h1>
                </div>
                <div className="row">
                    <div className="col-12 col-xl-6">
                        <div id="map">My map will go here</div>
                    </div>
                    <div className="col-12 col-xl-6">
                        <div w3-include-html="information.html"></div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Information;
