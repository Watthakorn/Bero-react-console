import React, { Component } from 'react';
import '../../css/bero.css';


var allInfo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


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
                        <div className="row">
                            <div className="col-8">
                                <h2>Infomation table</h2>
                            </div>
                            <div className="col-4">
                                <div className="d-flex justify-content-end">
                                    <a href="#" className="btn btn-primary" data-toggle="modal" data-target="#createInfoModal"><i className="fa fa-plus-square"></i> create</a>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Detail</th>
                                        <th>Contact</th>
                                        <th>More</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <InfoRows />
                                </tbody>
                            </table>
                        </div>

                        <InfoModals />

                        <div className="modal fade" id="createInfoModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLongTitle">Create Infomation</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Form infomation detail will go here.</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary">Create</button>
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

function InfoRows(props) {
    var inforows = [];

    for (let index = 0; index < allInfo.length; index++) {
        inforows.push(<InfoRow key={"inforow" + index} infoid={index} target={"#targetinfo" + index} />);
    }
    return inforows;

}
function InfoRow(props) {
    return (
        <tr>
            <td>{props.infoid}</td>
            <td>Hospital</td>
            <td>hospital here</td>
            <td>hospital@bero.com</td>
            <td><a href="#" className="btn btn-primary" data-toggle="modal" data-target={props.target}><i className="fa fa-info-circle"></i> detail</a></td>
        </tr>
    );

}
function InfoMao(params) {

}

function InfoModals(props) {
    var infomodals = [];

    for (let index = 0; index < allInfo.length; index++) {
        infomodals.push(<InfoModal key={"infomodal" + index} infoid={index} target={"targetinfo" + index} />);
    }
    return infomodals;

}
function InfoModal(props) {
    return (
        <div className="modal fade" id={props.target} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Infomation: {props.infoid}</h5>
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

export default Information;
