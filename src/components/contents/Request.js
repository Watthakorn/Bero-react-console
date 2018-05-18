import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { compose, withProps, withStateHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import { connect } from "react-redux"
// import GeoFire from "geofire"


// var today = new Date();
// var todayDate = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1) + '-' + today.getDate();

// var allEvent = [];
var allRequest = [];
var requestsRef = fire.database().ref('requests');
requestsRef.on('child_added', snap => {
    let request = { id: snap.key, data: snap.val() }
    // this.setState({ users: [user].concat(this.state.users) });
    // console.log(snap.val());
    if (request.data.requestType === 'Event') {
        // allEvent.push(request);
    } else {
        allRequest.push(request)
    }
});




class Request extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pagenumber: 1,
            itemperpage: 6,
        };
    }


    componentWillMount() {


        requestsRef.on('child_changed', snap => {
            let request = { id: snap.key, data: snap.val() }
            if (request.data.requestType === "Event") {
                // for (let i in allEvent) {
                //     if (allEvent[i].id === request.id) {
                //         allEvent[i].data = request.data;
                //         break;
                //     }
                // }
                // this.props.addEvent(allEvent);
            } else {
                for (let i in allRequest) {
                    if (allRequest[i].id === request.id) {
                        allRequest[i].data = request.data;
                        break;
                    }
                }
                this.props.addRequest(allRequest);
            }
        });
        requestsRef.on('child_removed', snap => {
            let request = { id: snap.key, data: snap.val() }
            if (request.data.requestType === "Event") {
                // for (let i in allEvent) {
                //     if (allEvent[i].id === request.id) {
                //         allEvent.splice(i, 1)
                //         break;
                //     }
                // }
                // this.props.addEvent(allEvent);
            } else {
                for (let i in allRequest) {
                    if (allRequest[i].id === request.id) {
                        allRequest.splice(i, 1)
                        break;
                    }
                }
                this.props.addRequest(allRequest);
            }
        });



        // this.props.addEvent(allEvent);
        this.props.addRequest(allRequest);

        // console.log(this.props.events.events);

    }
    _handleChangePage(e) {
        if (this.state.page === 1) {
            this.setState({
                page: 2,
            })
        } else {
            this.setState({
                page: 1,
            })
        }
    }


    _handlePagination(e) {
        e.preventDefault();
        this.setState({
            pagenumber: e.target.value,
        })
        // console.log(e.target.value)
    }


    render() {
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <h1 className="page-title"><i className="fa fa-child"></i>Current Request</h1>
                </div>
                {/* <input type="text" value={this.state.value} onChange={this.handleChange} /> */}
                {/* {this.state.value} */}
                {/* slide */}
                {/* <Slide testvalue="Testtteetetetet" /> */}


                {/* card */}
                <ul className="pagination">
                    <Page page={Math.ceil(allRequest.length / this.state.itemperpage)}
                        pagenumber={this.state.pagenumber} onClick={(e) => this._handlePagination(e)} />
                </ul>

                {/* {JSON.stringify(allCode[0])} */}
                <div className="row">
                    <RequestCards requests={allRequest} pagenumber={this.state.pagenumber} itemperpage={this.state.itemperpage} />
                </div>

                <RequestModals requests={allRequest} page={this.state.page}
                    pagenumber={this.state.pagenumber} itemperpage={this.state.itemperpage}
                    onPageClick={(e) => this._handleChangePage(e)} />
            </div>
        );
    }
}

function Page(props) {
    var pages = [];
    if (props.page) {
        for (let index = 0; index < props.page; index++) {
            pages.push(<li key={index} className="page-item"><button onClick={props.onClick} className="page-link" value={index + 1}>{index + 1}</button></li>)
        }
    }
    return pages;
}

function RequestCards(props) {

    var eventcards = [];
    var allRequest = props.requests;
    // console.log(allEvent)
    var requestlength = allRequest.length;
    var page = props.pagenumber;
    var itemperpage = props.itemperpage;
    var lastpage = Math.ceil(requestlength / itemperpage);

    allRequest.sort(function (a, b) { return (b.data.when - a.data.when) });

    if (allRequest) {
        if (page >= lastpage && requestlength % itemperpage !== 0) {
            for (let index = 0; index < requestlength % itemperpage; index++) {
                let request = allRequest[index + (itemperpage * (page - 1))];
                if (request) {
                    eventcards.push(<RequestCard key={request.id} request={request}
                        requestNo={index + (itemperpage * (page - 1)) + 1} target={"#" + request.id} />);
                }
            }
        } else {
            for (let index = 0; index < itemperpage; index++) {
                let request = allRequest[index + (itemperpage * (page - 1))];
                if (request) {
                    eventcards.push(<RequestCard key={request.id} request={request}
                        requestNo={index + (itemperpage * (page - 1)) + 1} target={"#" + request.id} />);
                }
            }
        }
    }
    // for (let index = 0; index < allRequest.length; index++) {
    //     let request = allRequest[index];
    //     eventcards.push(<RequestCard key={request.id} request={request} requestNo={index + 1} target={"#" + request.id} />);
    // }
    return eventcards;
}

function RequestCard(props) {
    return (
        <div className="col-md-6 col-xl-4 event-card">
            <div className="card text-right">
                <div className="bero-eventpic">
                    <img className="card-img-top" src={props.request.data.imageUrl} alt="requestImg" />
                </div>
                <div className="card-body">
                    <h5 className="card-title">Request: {props.requestNo}</h5>
                    <p className="card-text topic-overflow">{props.request.data.topic}</p>
                    {props.request.data.status === "done" ?
                        <a href="" className="btn btn-success" data-toggle="modal" data-target={props.target}><i className="fa fa-check-square-o" /> Done</a>
                        : <a href="" className="btn btn-warning" data-toggle="modal" data-target={props.target}><i className="fa fa-info" /> Inprogress</a>
                    }
                </div>
            </div>
        </div>
    );

}

function RequestModals(props) {
    var requestmodals = [];

    var allRequest = props.requests;
    // console.log(allEvent)
    // console.log(props.events)
    var requestlength = allRequest.length;
    var page = props.pagenumber;
    var itemperpage = props.itemperpage;
    var lastpage = Math.ceil(requestlength / itemperpage);
    if (allRequest) {
        if (page >= lastpage && requestlength % itemperpage !== 0) {
            for (let index = 0; index < requestlength % itemperpage; index++) {
                let request = allRequest[index + (itemperpage * (page - 1))];
                if (request) {
                    requestmodals.push(<RequestModal key={request.id} request={request} requestNo={index + 1}
                        target={request.id} onClick={props.onPageClick} page={props.page} />);
                }
            }
        } else {
            for (let index = 0; index < itemperpage; index++) {
                let request = allRequest[index + (itemperpage * (page - 1))];
                if (request) {
                    requestmodals.push(<RequestModal key={request.id} request={request} requestNo={index + 1}
                        target={request.id} onClick={props.onPageClick} page={props.page} />);
                }
            }
        }
    }


    // for (let index = 0; index < allRequest.length; index++) {
    //     let request = allRequest[index];
    //     requestmodals.push(<RequestModal key={request.id} request={request} requestNo={index + 1} target={request.id} onClick={props.onPageClick} page={props.page} />);
    // }
    return requestmodals;

}

function RequestModal(props) {
    var participantView = [];
    // var ownerView = [];
    var helpers = props.request.data.Helpers;
    if (props.request.data.owneruid) {
        var ownerRef = fire.database().ref('users/' + props.request.data.owneruid);
        ownerRef.on('value', function (snapshot) {
            participantView.push(
                <div key={snapshot.key}>
                    <div className="row">
                        <div className="col-3">
                            <div className="col-12">
                                <img alt="profilePic" src={snapshot.val().Profile.profilePicture} style={{ "height": "75px", "width": "75px" }} className="border border-primary rounded" />
                            </div>
                        </div>
                        <div className="col-9 container-fluid d-flex align-content-around flex-wrap justify-content-start">
                            <div className="col-12">
                                <p className="font-weight-bold" style={{ "wordWrap": "break-word" }}>{snapshot.val().Profile.displayName} (Owner)</p>
                            </div>
                            <div className="col-12 font-weight-light mt-auto">
                                {snapshot.val().Profile.facebookUid}
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>);
        });
    }
    if (helpers) {
        var participants = Object.keys(helpers);
        for (let index = 0; index < participants.length; index++) {
            let participant = participants[index];
            // console.log(participant)
            var participantRef = fire.database().ref('users/' + participant);
            participantRef.on('value', function (snapshot) {
                // owner = snapshot.val();
                // console.log(snapshot.key)

                participantView.push(
                    <div key={snapshot.key + "" + index}>
                        <div className="row">
                            <div className="col-3">
                                <div className="col-12">
                                    <img alt="profilePic" src={snapshot.val().Profile.profilePicture} style={{ "height": "75px", "width": "75px" }} className="border border-primary rounded" />
                                </div>
                            </div>
                            <div className="col-9 container-fluid d-flex align-content-around flex-wrap">
                                <div className="col-12">
                                    <p style={{ "wordWrap": "break-word" }}>{snapshot.val().Profile.displayName}</p>
                                </div>
                                <div className="col-12 font-weight-light mt-auto">
                                    {snapshot.val().Profile.facebookUid}
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>);
            });
        }
    }
    return (
        <div className="modal fade" id={props.target} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Request: {props.requestNo}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        {props.page === 1 ?
                            <div>
                                <button type="button" onClick={props.onClick}>View Participant</button>
                                <hr />
                            </div>
                            : <button type="button" onClick={props.onClick}>View Detail</button>
                        }
                        <br />
                        {props.page === 1
                            ?
                            <div>
                                <div className="form-row">
                                    <div className="form-group col-12">
                                        <img id="img-upload"
                                            src={props.request.data.imageUrl}
                                            className="mx-auto d-block"
                                            alt="requestImg"
                                        // style={{ maxHeight: '300px' }}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    {/* <!-- Form Input --> */}
                                    <div className="form-group col-lg-6">
                                        {/* eventName & participant */}
                                        <div className="form-row">
                                            <div className="form-group col-sm-8">
                                                <label htmlFor="eventName">Request Name</label>
                                                <input type="text"
                                                    className="form-control"
                                                    name="eventName"
                                                    defaultValue={props.request.data.topic}
                                                    disabled="disabled"
                                                />
                                            </div>
                                            <div className="form-group col-sm-4">
                                                <label htmlFor="participant">Participant</label>
                                                <input type="number"
                                                    className="form-control"
                                                    name="participant"
                                                    defaultValue={props.request.data.hero}
                                                    disabled="disabled"
                                                />
                                            </div>
                                        </div>


                                        <div className="form-group">
                                            <label htmlFor="timeRequest">RequestTime</label>
                                            <input type="text"
                                                className="form-control"
                                                name="participant"
                                                defaultValue={(new Date(props.request.data.when)).toString()}
                                                disabled="disabled"
                                            />
                                        </div>


                                        {/* detail */}
                                        <div className="form-group">
                                            <label htmlFor="detail">Detail</label>
                                            <textarea className="form-control"
                                                name="detail"
                                                defaultValue={props.request.data.detail}
                                                style={{ minHeight: '275px' }}
                                                disabled="disabled"
                                            />
                                        </div>


                                    </div>


                                    <div className="form-group col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="mapEvent">Position</label>
                                            <MyMapComponent3 information={props.request} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="location">Location</label>
                                            <textarea className="form-control"
                                                name="location"
                                                defaultValue={props.request.data.location}
                                                style={{ minHeight: '100px' }}
                                                disabled="disabled"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                            : <div>
                                <hr /> {participantView}
                            </div>
                        }

                    </div>


                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );

}



// function testA() {
//     console.log("This form testA");
// }



const MyMapComponent3 = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCTYHNPsOIlGpD30J91XzKH-NDzqpUA71M&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `300px` }} />,
        mapElement: <div style={{ height: `100%`, width: '100%' }} />,
    }),
    withStateHandlers(() => ({
        isOpen: true,
    }), {
            onToggleOpen: ({ isOpen }) => () => ({
                isOpen: !isOpen,
            })
        }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: props.information.data.mark_position.latitude, lng: props.information.data.mark_position.longitude }}
    >
        <Marker
            position={{ lat: props.information.data.mark_position.latitude, lng: props.information.data.mark_position.longitude }}
            onClick={props.onToggleOpen}
        >
            {props.isOpen && <InfoWindow onCloseClick={props.onToggleOpen}>
                <div style={{ maxWidth: "175px" }}>
                    <div className="font-weight-bold">
                        {props.information.data.topic}
                    </div>
                    <div>
                        {props.information.data.location}
                    </div>
                </div>
            </InfoWindow>}
        </Marker>

    </GoogleMap>
)


const mapStateToProps = (state) => {

    // console.log(state)
    return {
        markerPosition: state.positionReducer,
        events: state.eventsReducer,
        requests: state.requestsReducer,
        reports: state.reportsReducer,
        users: state.usersReducer,
        user: state.userReducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changePosition: (position) => {
            dispatch({
                type: "CHANGE_LOCATION",
                payload: position
            })
        },
        addEvent: (events) => {
            dispatch({
                type: "EVENTS_FETCH",
                payload: events
            })
        },
        addRequest: (requests) => {
            dispatch({
                type: "REQUESTS_FETCH",
                payload: requests
            })
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Request);









