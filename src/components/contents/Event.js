import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { compose, withProps, lifecycle, withStateHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import { connect } from "react-redux"
import GeoFire from "geofire"


var positionFirst = {
    lat: 13.719349,
    lng: 100.781223
};
var today = new Date();
var todayDate = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1) + '-' + today.getDate();

var allEvent = [];
// var allRequest = [];
var requestsRef = fire.database().ref('requests');
requestsRef.on('child_added', snap => {
    let request = { id: snap.key, data: snap.val() }
    // this.setState({ users: [user].concat(this.state.users) });
    // console.log(snap.val());
    if (request.data.requestType === 'Event') {
        allEvent.push(request);
    } else {
        // allRequest.push(request)
    }
});



var allCodeKey = [];
var allCode = [];
var codesRef = fire.database().ref('codes');
codesRef.on('child_added', snap => {
    let code = { id: snap.key, data: snap.val() }
    // this.setState({ users: [user].concat(this.state.users) });
    // console.log(snap.val());
    if (allCodeKey.includes(code.data.event)) {
        allCode[allCodeKey.indexOf(code.data.event)].push([code.id, code.data.status]);
    } else {
        allCodeKey.push(code.data.event);
        allCode.push([[code.id, code.data.status]]);
    }
});




class Event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            imagePreviewUrl: 'no-img.png',
            eventName: '',
            participant: 10,
            startDate: todayDate,
            endDate: todayDate,
            detail: '',
            location: '',
            showModal: true,
            progressBar: '',
            disabled: false,
            showCreate: true,
            tag: '',
            shortName: '',
            page: 1,
            pageEvent: 1,
            changeMarker: '',
            currentId: ''
        };
    }

    componentWillMount() {

        requestsRef.on('child_changed', snap => {
            let request = { id: snap.key, data: snap.val() }
            if (request.data.requestType === "Event") {
                for (let i in allEvent) {
                    if (allEvent[i].id === request.id) {
                        allEvent[i].data = request.data;
                        break;
                    }
                }
                this.props.addEvent(allEvent);
            } else {
                // for (let i in allRequest) {
                //     if (allRequest[i].id === request.id) {
                //         allRequest[i].data = request.data;
                //         break;
                //     }
                // }
                // this.props.addRequest(allRequest);
            }
        });
        requestsRef.on('child_removed', snap => {
            let request = { id: snap.key, data: snap.val() }
            if (request.data.requestType === "Event") {
                for (let i in allEvent) {
                    if (allEvent[i].id === request.id) {
                        allEvent.splice(i, 1)
                        break;
                    }
                }
                this.props.addEvent(allEvent);
            } else {
                // for (let i in allRequest) {
                //     if (allRequest[i].id === request.id) {
                //         allRequest.splice(i, 1)
                //         break;
                //     }
                // }
                // this.props.addRequest(allRequest);
            }
        });



        this.props.addEvent(allEvent);
        // this.props.addRequest(allRequest);

        // console.log(this.props.events.events);

    }




    _handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });

        // console.log(this.props.user.user.providerData[0].uid)
        // console.log((new Date('2018-02-01')).getDate())
        // console.log(this.state.startDate)
        // console.log(this.state[name]);
    }




    _handleSubmit(e) {
        e.preventDefault();
        // console.log(e.target);


        // TODO: do something with -> this.state.file
        var thisState = this;
        var state = this.state;
        var props = this.props;
        var storage = fire.storage();
        var eventRef = storage.ref("event");
        var fileName = state.file.name;
        var imageRef = eventRef.child(fileName);
        var markerPosition = props.markerPosition;
        var databaseRef = fire.database().ref('requests');
        var codeRef = fire.database().ref('codes');
        var newEventKey = databaseRef.push().key;
        var geoFire = new GeoFire(fire.database().ref('geofire'));
        // console.log(newEventKey)

        imageRef.getDownloadURL().then(onResolve, onReject);

        //if file name already exists
        function onResolve(foundURL) {
            fileName = fileName + "_dup"
            imageRef = eventRef.child(fileName);
            imageRef.getDownloadURL().then(onResolve, onReject);

        }
        // if file name is unique
        function onReject(error) {

            thisState.setState({
                disabled: true
            })

            var uploadTask = imageRef.put(state.file);
            var downloadURL;
            // use in uploadTask complete

            uploadTask.on('state_changed', function (snapshot) {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log('Upload is ' + progress + '% done');
                thisState.setState({
                    progressBar: progress + "%"
                });
                // console.log(state.progressText)


            }, function (error) {
                // Handle unsuccessful uploads
            }, function () {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                downloadURL = uploadTask.snapshot.downloadURL;
                // console.log(downloadURL);
                // console.log(markerPosition);
                var startDate = new Date(state.startDate);
                var endDate = new Date(state.endDate);

                var formatStartDate = startDate.getDate() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getFullYear();
                var formatEndDate = endDate.getDate() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getFullYear();



                //database push HERE
                databaseRef.child(newEventKey).set({
                    detail: state.detail,
                    facebookUid: props.user.user.providerData[0].uid,
                    hero: state.participant,
                    heroAccepted: 0,
                    imageUrl: downloadURL,
                    location: state.location,
                    mark_position: {
                        latitude: markerPosition.lat,
                        longitude: markerPosition.lng
                    },
                    must_be: 'all',
                    ownerName: props.user.user.displayName,
                    ownerprofilePicture: "http://graph.facebook.com/" + props.user.user.providerData[0].uid + "/picture?type=square",
                    ownerUid: props.user.user.uid,
                    rated: 0,
                    tag: state.tag,
                    requestType: 'Event',
                    timeEvent: formatStartDate + '-' + formatEndDate,
                    startDate: state.startDate,
                    endDate: state.endDate,
                    status: 'in-progress',
                    topic: state.eventName,
                    type: 'Any',
                    view: 'Pubilc',
                    when: Date.now()


                })

                for (let index = 0; index < state.participant; index++) {
                    createCode({ code: state.shortName, newEventKey: newEventKey })
                }

                geoFire.set(newEventKey, [markerPosition.lat, markerPosition.lng])


                thisState.setState({
                    showCreate: false
                })
            });
        }



        // console.log(markerPosition);
        // console.log('handle uploading-', state.file);
        // console.log(state);


    }





    _handleImageChange(e) {
        // console.log(e.target.files);
        e.preventDefault();
        // console.log(e.target);

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file)
    }
    // _handleDone(event) {
    //     event.preventDefault();

    //     this.setState = {
    //         file: '',
    //         imagePreviewUrl: 'no-img.png',
    //         eventName: '',
    //         participant: 10,
    //         startDate: '',
    //         endDate: '',
    //         detail: '',
    //         showModal: true,
    //         progressBar: '',
    //         disabled: false,
    //         showCreate: true
    //     };
    // }

    // _handleOnClear(e) {
    //     e.preventDefault();

    //     this.setState = {
    //         file: '',
    //         imagePreviewUrl: 'no-img.png',
    //         eventName: '',
    //         participant: 10,
    //         startDate: '',
    //         endDate: '',
    //         detail: '',
    //         showModal: true,
    //         progressBar: '',
    //         disabled: false,
    //         showCreate: true
    //     };

    // }

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

    _handleChangePage2(e) {
        if (this.state.page === 1) {
            this.setState({
                page: 3,
            })
        } else {
            this.setState({
                page: 1,
            })
        }
    }

    _handleChangePageEvent(e) {
        if (this.state.pageEvent === 1) {
            this.setState({
                pageEvent: 2,
            })
        } else {
            this.setState({
                pageEvent: 1,
            })
        }
    }

    _handleSaveChange(e) {
        e.preventDefault();
        // var userId = e.target.value;
        // console.log(e.target.id);
        var formatDate = '';
        var start = '';
        var end = '';
        if (e.target.startDate && e.target.endDate) {
            var startDate = new Date(e.target.startDate.value);
            var endDate = new Date(e.target.endDate.value);

            var formatStartDate = startDate.getDate() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getFullYear();
            var formatEndDate = endDate.getDate() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getFullYear();

            formatDate = formatStartDate + '-' + formatEndDate;
            start = e.target.startDate.value;
            end = e.target.endDate.value;
        } else {
            formatDate = e.target.timeDate.value;
        }
        if (e.target.id === this.state.currentId) {
            fire.database().ref('requests/' + e.target.id).update({
                topic: e.target.eventName.value,
                tag: e.target.tag.value,
                detail: e.target.detail.value,
                startDate: start,
                endDate: end,
                timeEvent: formatDate,
                location: e.target.location.value,
                mark_position: {
                    latitude: this.state.changeMarker.lat,
                    longitude: this.state.changeMarker.lng
                },
            });
        }
        else {
            fire.database().ref('requests/' + e.target.id).update({
                topic: e.target.eventName.value,
                tag: e.target.tag.value,
                detail: e.target.detail.value,
                startDate: start,
                endDate: end,
                timeEvent: formatDate,
                location: e.target.location.value,
            });
        }

        e.target.submitBtn.disabled = "disabled";
        e.target.eventName.disabled = "disabled";
        e.target.tag.disabled = "disabled";
        e.target.detail.disabled = "disabled";
        e.target.location.disabled = "disabled";
        if (e.target.startDate && e.target.endDate) {
            e.target.startDate.disabled = "disabled";
            e.target.endDate.disabled = "disabled";
        }
        // alert("Your changes have been saved\n\nPlease refresh page to see your changes");
        // console.log("hey wake up!");
    }

    _copyToClipboard(e) {
        e.preventDefault();
        var textField = document.createElement('textarea');
        textField.innerText = e.target.value;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        if (e.target.value) {
            alert("Copied code: " + "success!");
        } else {
            alert("Copied code: " + "fail! please try again");

        }
        textField.remove();
    }

    render() {
        let { imagePreviewUrl } = this.state;
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <div className="pt-2">
                        <button className="btn btn-info rounded-circle text-center font-weight-bold" style={{ "marginRight": "10px" }} data-toggle="modal" data-target="#createEventModal">+</button>
                    </div>
                    <h1 className="page-title"><i className="fa fa-gears"></i> Manage</h1>
                </div>
                {/* <input type="text" value={this.state.value} onChange={this.handleChange} /> */}
                {/* {this.state.value} */}
                {/* slide */}
                {/* <Slide testvalue="Testtteetetetet" /> */}


                {/* card */}

                {/* {JSON.stringify(allCode[0])} */}
                <div className="card-columns event-card">

                    <EventCards events={allEvent} />
                </div>



                {/* <!-- Create Event modal or move modal to here --> */}
                {/* <CreateEventModal imageevent={this.state.image} /> */}
                <div className="modal fade" id="createEventModal" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" >
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLongTitle">Create</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>




                            {/* <!-- Form --> */}
                            <form onSubmit={(e) => this._handleSubmit(e)} id="createEvent" >
                                <div className="modal-body">
                                    <div className="form-row">
                                        <div className="form-group col-12">

                                            <label htmlFor="imgInp">Image :</label>

                                            <input type="file"
                                                id="imgInp"
                                                onChange={(e) => this._handleImageChange(e)}
                                                disabled={(this.state.disabled) ? "disabled" : ""}
                                                required
                                            />

                                            <img id="img-upload"
                                                src={imagePreviewUrl}
                                                className="mx-auto d-block"
                                                alt="Image"
                                                width="900"
                                                height="400"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        {/* <!-- Form Input --> */}
                                        <div className="form-group col-lg-6">
                                            {/* eventName & participant */}
                                            <div className="form-row">
                                                <div className="form-group col-sm-8">
                                                    <label htmlFor="eventName">Event Name</label>
                                                    <input type="text"
                                                        className="form-control"
                                                        name="eventName"
                                                        value={this.state.eventName}
                                                        onChange={(e) => this._handleInputChange(e)}
                                                        disabled={(this.state.disabled) ? "disabled" : ""}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group col-sm-4">
                                                    <label htmlFor="shortName">Code*</label>
                                                    <input type="text"
                                                        className="form-control"
                                                        name="shortName"
                                                        onChange={(e) => this._handleInputChange(e)}
                                                        disabled={(this.state.disabled) ? "disabled" : ""}
                                                        maxLength='3'
                                                        required
                                                    // disabled="disabled"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-sm-8">
                                                    <label htmlFor="tag">Tag</label>
                                                    <input type="text"
                                                        className="form-control"
                                                        name="tag"
                                                        value={this.state.tag}
                                                        onChange={(e) => this._handleInputChange(e)}
                                                        disabled={(this.state.disabled) ? "disabled" : ""}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group col-sm-4">
                                                    <label htmlFor="participant">Participant</label>
                                                    <input type="number"
                                                        className="form-control"
                                                        name="participant"
                                                        value={this.state.participant}
                                                        onChange={(e) => this._handleInputChange(e)}
                                                        disabled={(this.state.disabled) ? "disabled" : ""}
                                                        required
                                                    />
                                                </div>
                                            </div>


                                            {/* <!-- if datepicker not work will use datepicker.js instead --> */}


                                            {/* startDate & endDate */}
                                            <div className="form-row">
                                                <div className="form-group col-sm-6">
                                                    <label htmlFor="startDate">Start</label>
                                                    <input className="form-control"
                                                        type="date"
                                                        name="startDate"
                                                        min={todayDate}
                                                        value={this.state.startDate}
                                                        onChange={(e) => this._handleInputChange(e)}
                                                        disabled={(this.state.disabled) ? "disabled" : ""}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group col-sm-6">
                                                    <label htmlFor="endDate">End</label>
                                                    <input className="form-control"
                                                        type="date"
                                                        name="endDate"
                                                        min={this.state.startDate}
                                                        value={this.state.endDate < this.state.startDate ? this.state.startDate : this.state.endDate}
                                                        onChange={(e) => this._handleInputChange(e)}
                                                        disabled={(this.state.disabled) ? "disabled" : ""}
                                                        required
                                                    />
                                                </div>
                                            </div>


                                            {/* detail */}
                                            <div className="form-group">
                                                <label htmlFor="detail">Detail</label>
                                                <textarea className="form-control"
                                                    name="detail"
                                                    value={this.state.detail}
                                                    onChange={(e) => this._handleInputChange(e)}
                                                    disabled={(this.state.disabled) ? "disabled" : ""}
                                                    style={{ minHeight: '190px' }}
                                                    required
                                                />
                                            </div>
                                        </div>


                                        {/* <!-- Form map --> */}
                                        <div className="form-group col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="mapEvent">Position</label>
                                                <MyMapComponent isMarkerShown mapProps={this.props} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="location">Location**</label>
                                                <textarea className="form-control"
                                                    name="location"
                                                    value={this.state.location}
                                                    onChange={(e) => this._handleInputChange(e)}
                                                    disabled={(this.state.disabled) ? "disabled" : ""}
                                                    style={{ minHeight: '100px' }}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="text-danger font-weight-light font-italic col-12" style={{ color: "red", fontSize: "12px" }}>*3 character of Event for generate code</div>
                                        <div className="text-danger font-weight-light font-italic col-12" style={{ color: "red", fontSize: "12px" }}>**In case of position error</div>
                                        <div className="text-danger font-weight-light font-italic col-12" style={{ color: "red", fontSize: "12px" }}>***Image and Participant can't be edited please be careful before click 'Create'</div>
                                        {/* progress bar */}
                                        <div className="progress col-12">
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: this.state.progressBar }} />
                                        </div>
                                    </div>
                                </div>


                                {/* footer button */}
                                {this.state.showCreate ?
                                    <div className="modal-footer">
                                        <button type="button"
                                            className="btn btn-secondary"
                                            disabled={(this.state.disabled) ? "disabled" : ""}
                                            data-dismiss="modal">
                                            Close
                                        </button>
                                        <button type="submit"
                                            className="btn btn-primary"
                                            value="createEvent"
                                            disabled={(this.state.disabled) ? "disabled" : ""}>
                                            Create
                                        </button>
                                    </div>
                                    :
                                    <div className="modal-footer">
                                        {/* <button type="button" className="btn btn-primary" onClick={(e) => this._handleOnClear(e)}> Clear</button> */}
                                        <button type="button" className="btn btn-success" data-dismiss="modal"> Done</button>
                                    </div>}
                            </form>
                            {/* <!-- End Form Event --> */}
                        </div>
                    </div>
                </div>

                <EventModals events={allEvent} page={this.state.page} infostate={this}
                    onSubmit={(e) => this._handleSaveChange(e)}
                    onPageClick={(e) => this._handleChangePage(e)}
                    onPageClick2={(e) => this._handleChangePage2(e)}
                    onClickCopy={(e) => this._copyToClipboard(e)} />
            </div>
        );
    }
}

function createCode(props) {
    var character = "abcdefghijklmnopqrstuvwxyzABCDEFGHITKLMNOPQRSTUVWXYZ0123456789"
    var newCode = props.code
    for (let i = 0; i < 3; i++) {
        newCode += character[Math.floor(Math.random() * 62)]
    }
    checkCodeExist({ newCode: newCode, newEventKey: props.newEventKey });
}

function checkCodeExist(props) {
    var character = "abcdefghijklmnopqrstuvwxyzABCDEFGHITKLMNOPQRSTUVWXYZ0123456789"
    codesRef.child(props.newCode).once("value", snapshot => {
        const codeData = snapshot.val();
        if (codeData) {
            checkCodeExist({ newCode: props.newCode + character[Math.floor(Math.random() * 62)], newEventKey: props.newEventKey })
        } else {
            codesRef.child(props.newCode).update({
                event: props.newEventKey,
                status: 'not_activate',
            })
        }
    });

}

function EventCards(props) {

    var eventcards = [];
    var allEvent = props.events;
    // console.log(allEvent)
    allEvent.sort(function (a, b) { return (b.data.status > a.data.status) ? 1 : ((a.data.status > b.data.status) ? -1 : 0); });

    for (let index = 0; index < allEvent.length; index++) {
        let event = allEvent[index];
        eventcards.push(<EventCard key={event.id} event={event} eventNo={index + 1} target={"#" + event.id} />);
    }
    return eventcards;
}

function EventCard(props) {
    return (
        <div className="card text-right">
            <div className="bero-eventpic">
                <img className="card-img-top" src={props.event.data.imageUrl} alt="Card image" />
            </div>
            <div className="card-body">
                <h5 className="card-title">Event: {props.eventNo}</h5>
                <p className="card-text topic-overflow">{props.event.data.topic}</p>
                {props.event.data.status === "done" ?
                    <a href="" className="btn btn-success" data-toggle="modal" data-target={props.target}><i className="fa fa-check-square-o" /> Done</a>
                    : <a href="" className="btn btn-warning" data-toggle="modal" data-target={props.target}><i className="fa fa-info" /> Inprogress</a>
                }
            </div>
        </div>
    );

}


function EventModals(props) {
    var eventmodals = [];

    var allEvent = props.events;
    // console.log(allEvent)
    // console.log(props.events)

    for (let index = 0; index < allEvent.length; index++) {
        let event = allEvent[index];
        eventmodals.push(<EventModal key={event.id} event={event} page={props.page} onSubmit={props.onSubmit}
            eventNo={index + 1} target={event.id} infostate={props.infostate}
            onClick={props.onPageClick} onClick2={props.onPageClick2} onCopy={props.onClickCopy} />);
    }
    return eventmodals;
}
function EventModal(props) {
    var codeView = [];
    var codeString = [];
    var codes = allCode[allCodeKey.indexOf(props.event.id)];
    if (codes) {
        for (let index = 0; index < codes.length; index++) {
            let code = codes[index];
            codeView.push(
                <div key={code[0]}>
                    <div className="row">
                        <div className="col-6">
                            {code[0]}
                        </div>
                        <div className="col-6">
                            {code[1] === "not_activate" ? <p className="text-danger">Not Activate</p> : <p className="text-success">Activated</p>}
                        </div>
                    </div>
                    <hr />
                </div>);
            codeString.push(code[0]);
            // console.log(codeString)
        }
    }
    var commentView = [];
    var comments = props.event.data.Comments;
    if (comments) {
        var commentsKey = Object.keys(comments);
        for (let index = 0; index < commentsKey.length; index++) {
            let commentKey = commentsKey[index]
            let comment = comments[commentKey];
            // console.log(comment);
            var commentDate = new Date(comment.when);


            // var commentDateFormat = commentDate.getDate() + ' ' + (commentDate.getMonth() + 1) + ' ' + commentDate.getFullYear()
            //     + ' ' + commentDate.getHours() + ':' + commentDate.getMinutes();
            // console.log(commentDate)
            commentView.push(
                <div key={commentKey}>
                    <div className="row">
                        <div className="col-2">
                            <div className="col-12">
                                <img src={comment.ownerprofilePicture} style={{ "height": "75px", "width": "75px" }} className="border border-primary rounded" />
                            </div>
                            <div className="col-12 font-weight-bold">
                                {comment.ownerName}
                            </div>
                        </div>
                        <div className="col-10 container-fluid d-flex align-content-around flex-wrap">
                            <div className="col-12">
                                <p style={{ "wordWrap": "break-word" }}>{comment.comment}</p>
                            </div>
                            <div className="col-12 font-weight-light mt-auto">
                                {commentDate.toString()}
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>);
        }
    }
    // var page = 1;
    return (
        <div className="modal fade" id={props.target} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Event: {props.eventNo}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <form id={props.event.id} onSubmit={props.onSubmit}>
                        <div className="modal-body">
                            {codes ?
                                props.page === 1 ?
                                    <button style={{ marginRight: "10px" }} type="button" onClick={props.onClick}>View Codes</button>
                                    : '' : ''
                            }
                            {comments ?
                                props.page === 1 ?
                                    <button style={{ marginRight: "10px" }} type="button" onClick={props.onClick2}>View Comments</button>
                                    : '' : ''
                            }
                            {props.page === 1 ?
                                '' : props.page === 2 && codes ?
                                    <div>
                                        <button style={{ marginRight: "10px" }} type="button" onClick={props.onClick}>View Detail</button>
                                        <button className="btn" type="submit" onClick={props.onCopy} value={codeString}> <i className="fa fa-copy" /></button>
                                    </div>
                                    : <button type="button" onClick={props.onClick}>View Detail</button>
                            }
                            <hr />
                            {props.page === 1
                                ? <div>
                                    <div className="form-row">
                                        <div className="form-group col-12">
                                            <img id="img-upload"
                                                src={props.event.data.imageUrl}
                                                className="mx-auto d-block"
                                                alt="Image"
                                            // style={{ maxHeight: '300px' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        {/* <!-- Form Input --> */}
                                        <div className="form-group col-lg-6">
                                            {/* eventName & participant */}
                                            <div className="form-row">
                                                <div className="form-group col-sm-12">
                                                    <label htmlFor="eventName">Event Name</label>
                                                    <input type="text"
                                                        className="form-control"
                                                        name="eventName"
                                                        defaultValue={props.event.data.topic}
                                                    // disabled="disabled"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-sm-8">
                                                    <label htmlFor="tag">Tag</label>
                                                    <input type="text"
                                                        className="form-control"
                                                        name="tag"
                                                        defaultValue={props.event.data.tag}
                                                    // disabled="disabled"
                                                    />
                                                </div>
                                                <div className="form-group col-sm-4">
                                                    <label htmlFor="participant">Participant</label>
                                                    <input type="number"
                                                        className="form-control"
                                                        name="participant"
                                                        defaultValue={props.event.data.hero}
                                                        disabled="disabled"
                                                    />
                                                </div>
                                            </div>


                                            {/* <!-- if datepicker not work will use datepicker.js instead --> */}


                                            {/* startDate & endDate */}
                                            {props.event.data.startDate && props.event.data.endDate ?
                                                <div className="form-row">
                                                    <div className="form-group col-sm-6">
                                                        <label htmlFor="startDate">Start</label>
                                                        <input className="form-control"
                                                            type="date"
                                                            name="startDate"
                                                            min={todayDate}
                                                            defaultValue={props.event.data.startDate}
                                                            // disabled="disabled"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-group col-sm-6">
                                                        <label htmlFor="endDate">End</label>
                                                        <input className="form-control"
                                                            type="date"
                                                            name="endDate"
                                                            min={props.event.data.startDate}
                                                            defaultValue={props.event.data.endDate < props.event.data.startDate ? props.event.data.startDate : props.event.data.endDate}
                                                            // disabled="disabled"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                <div className="form-row">
                                                    <div className="form-group col-sm-12">
                                                        <label htmlFor="timeDate">Start-End</label>
                                                        <input className="form-control"
                                                            type="text"
                                                            name="timeDate"
                                                            defaultValue={props.event.data.timeEvent}
                                                            disabled="disabled"
                                                        />
                                                    </div>
                                                </div>}


                                            {/* detail */}
                                            <div className="form-group">
                                                <label htmlFor="detail">Detail</label>
                                                <textarea className="form-control"
                                                    name="detail"
                                                    defaultValue={props.event.data.detail}
                                                    style={{ minHeight: '190px' }}
                                                // disabled="disabled"
                                                />
                                            </div>
                                        </div>


                                        {/* <!-- Form map --> */}
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="mapEvent">Position</label>
                                                <MyMapComponent2 infostate={props.infostate} information={props.event} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="location">Location</label>
                                                <textarea className="form-control"
                                                    name="location"
                                                    defaultValue={props.event.data.location}
                                                    style={{ minHeight: '100px' }}
                                                // disabled="disabled"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-danger font-weight-light font-italic" style={{ color: "red", fontSize: "12px" }}>*Image and Participant can't be edited</div>


                                    </div>
                                </div>

                                : props.page === 2 ?
                                    <div>{codeView}</div>
                                    : <div>{commentView}</div>
                            }
                        </div>


                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            {props.page === 1 ?
                                <button name="submitBtn" type="submit" value={props.event.id} className="btn btn-primary">Save changes</button>
                                : ''}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


const MyMapComponent2 = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCTYHNPsOIlGpD30J91XzKH-NDzqpUA71M&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `300px` }} />,
        mapElement: <div style={{ height: `100%`, width: '100%' }} />,
    }),
    lifecycle({
        componentWillMount() {
            const refs = {}

            this.setState({

                onMarkerMounted: ref => {
                    refs.marker = ref;
                },

                onPositionChanged: () => {
                    const position = refs.marker.getPosition();
                    const infostate = refs.marker.props.infostate;
                    // console.log(refs.marker.props.information.id);
                    // console.log(position.lat())
                    // console.log(refs.marker.props.infostate)
                    infostate.setState({
                        currentId: refs.marker.props.information.id,
                        changeMarker: {
                            lat: position.lat(),
                            lng: position.lng()
                        }
                    })
                    // console.log(infostate.state)
                }
            })

        },
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
            label="C"
        >
        </Marker>
        <Marker
            position={{ lat: props.information.data.mark_position.latitude, lng: props.information.data.mark_position.longitude }}
            onClick={props.onToggleOpen} information={props.information} infostate={props.infostate}
            draggable={true} ref={props.onMarkerMounted} onPositionChanged={props.onPositionChanged}
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






const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCTYHNPsOIlGpD30J91XzKH-NDzqpUA71M&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `300px` }} />,
        mapElement: <div style={{ height: `100%`, width: '100%' }} />,
    }),
    lifecycle({
        componentWillMount() {
            const refs = {}

            this.setState({
                position: null,
                onMarkerMounted: ref => {
                    refs.marker = ref;
                },

                onPositionChanged: () => {
                    const position = refs.marker.getPosition();
                    // console.log(position.toString());
                    positionFirst = {
                        lat: position.lat(),
                        lng: position.lng()
                    }

                    this.props.mapProps.changePosition(positionFirst);


                    // console.log(this.props.mapProps.markerPosition);
                    // console.log(positionFirst);
                }
            })

        },
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={positionFirst}
    >
        {props.isMarkerShown &&
            <Marker position={positionFirst}
                draggable={true}
                ref={props.onMarkerMounted}
                onDragEnd={props.onPositionChanged}
            />}
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



export default connect(mapStateToProps, mapDispatchToProps)(Event);