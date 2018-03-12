import React, { Component } from 'react';
import '../../css/bero.css';

var allReport = [0, 1, 2, 3, 4, 5, 6, 7, 8];

class Report extends Component {
    render() {
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <h1 className="page-title"><i className="fa fa-file-text-o"></i> Report</h1>
                </div>

                <div className="card-columns">
                    <ReportCards />
                </div>
                <ReportModals />
            </div>
        );
    }
}

function ReportCards(params) {
    var reportcards = [];

    for (let index = 0; index < allReport.length; index++) {
        reportcards.push(<ReportCard key={"reportcard" + index} reportid={index} target={"#targetreport" + index} />);
    }
    return reportcards;
}

function ReportCard(props) {
    return (
        <div className="card text-right">
            <div className="card-header">Header {props.reportid}</div>
            <div className="card-body">
                <p className="card-text">Some quick example text and make up the bulk of the card's content.</p>
                <a href="#" className="btn btn-primary" data-toggle="modal" data-target={props.target}><i className="fa fa-info-circle" /> detail</a>
            </div>
        </div>
    );
}


function ReportModals(props) {
    var reportmodals = [];

    for (let index = 0; index < allReport.length; index++) {
        reportmodals.push(<ReportModal key={"reportmodal" + index} reportid={index} target={"targetreport" + index} />);
    }
    return reportmodals;

}
function ReportModal(props) {
    return (
        <div className="modal fade" id={props.target} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Report: {props.reportid}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Infomation detail will go here.</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );

}



export default Report;
