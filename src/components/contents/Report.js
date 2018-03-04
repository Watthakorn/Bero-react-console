import React, { Component } from 'react';
import '../../css/bero.css';

class Report extends Component {
    render() {
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <h1 className="page-title"><i className="fa fa-file-text-o"></i> Report</h1>
                </div>
                <div w3-include-html="report.html"></div>
            </div>
        );
    }
}


export default Report;
