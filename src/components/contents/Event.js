import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';
import { compose, withProps, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { connect } from "react-redux"


var positionFirst = {
    lat: 13.719349,
    lng: 100.781223
};
var allEvent = [0, 1, 2, 3, 4];
var today = new Date();
var todayDate = today.getFullYear() + '-' + (today.getMonth() < 10 ? '0' + today.getMonth() : today.getMonth()) + '-' + today.getDate();

class Event extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         image: "no-img.png",
    //         value: 0
    //     }
    //     this.handleChange = this.handleChange.bind(this);
    // }
    // handleChange(event) {
    //     this.setState({ image: event.target.value });
    // }
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            imagePreviewUrl: 'no-img.png',
            eventName: '',
            paticipant: 10,
            startDate: todayDate,
            endDate: todayDate,
            detail: '',
            showModal: true,
            progressBar: '',
            disabled: false,
            showCreate: true
        };
    }




    _handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
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


                //database push HERE
                databaseRef.push({
                    detail: state.detail,
                    facebookUid: '0000000000',
                    hero: state.paticipant,
                    heroAccepted: 0,
                    imageUrl: downloadURL,
                    mark_position: {
                        latitude: markerPosition.lat,
                        longitude: markerPosition.lng
                    },
                    must_be: 'all',
                    ownerName: 'none',
                    ownerprofilePicture: "http://graph.facebook.com/1449629778454500/picture?type=square",
                    ownerUid: "none",
                    rated: 0,
                    requestType: 'Event',
                    timeEvent: state.startDate + ' to ' + state.endDate,
                    status: 'in-progress',
                    topic: state.eventName,
                    type: 'Event',
                    view: 'Pubilc',
                    when: Date.now()


                })


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
    //         paticipant: 10,
    //         startDate: '',
    //         endDate: '',
    //         detail: '',
    //         showModal: true,
    //         progressBar: '',
    //         disabled: false,
    //         showCreate: true
    //     };

    // }

    render() {
        let { imagePreviewUrl } = this.state;
        return (
            <div>
                <div className="d-flex justify-content-end">
                    <div className="pt-2">
                        <button className="btn btn-info rounded-circle text-center font-weight-bold" data-toggle="modal" data-target="#createEventModal">+</button>
                    </div>
                    . .
                    <h1 className="page-title"><i className="fa fa-gears"></i> Manage</h1>
                </div>
                {/* <input type="text" value={this.state.value} onChange={this.handleChange} /> */}
                {/* {this.state.value} */}
                {/* slide */}
                <Slide testvalue="Testtteetetetet" />


                {/* card */}

                <div className="card-columns event-card">
                    <EventCards />
                </div>

                <EventModals />


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
                            <form onSubmit={(e) => this._handleSubmit(e)} >
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
                                            {/* eventName & paticipant */}
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
                                                    <label htmlFor="participant">Participant</label>
                                                    <input type="number"
                                                        className="form-control"
                                                        name="paticipant"
                                                        value={this.state.paticipant}
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
                                                    required
                                                />
                                            </div>
                                        </div>


                                        {/* <!-- Form map --> */}
                                        <div className="form-group col-lg-6">
                                            <label htmlFor="mapEvent">Position</label>
                                            <MyMapComponent isMarkerShown mapProps={this.props} />
                                        </div>


                                        {/* progress bar */}
                                        <div className="progress col-12">
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: this.state.progressBar }} />
                                        </div>
                                    </div>
                                </div>


                                {/* footer button */}
                                {this.state.showCreate ?
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary"> Create</button>
                                    </div>
                                    :
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary" data-dismiss="modal"> Done</button>
                                    </div>}
                            </form>
                            {/* <!-- End Form Event --> */}




                        </div>
                    </div>
                </div>
            </div>
        );
    }
}






function Slide(props) {
    return (
        <div id="demo" className="carousel slide bg-dark" data-ride="carousel">
            <ul className="carousel-indicators">
                <li data-target="#demo" data-slide-to="0" className="active"></li>
                <li data-target="#demo" data-slide-to="1"></li>
                <li data-target="#demo" data-slide-to="2"></li>
            </ul>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src="no-img.png" className="mx-auto d-block" alt="Los Angeles" width="1100" height="500" />
                    <div className="carousel-caption">
                        <h3>Test 1</h3>
                        <p>{props.testvalue}</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="no-img.png" className="mx-auto d-block" alt="Chicago" width="1100" height="500" />
                    <div className="carousel-caption">
                        <h3>Test 2</h3>
                        <p>Thank you, Chicago!</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="no-img.png" className="mx-auto d-block" alt="New York" width="1100" height="500" />
                    <div className="carousel-caption">
                        <h3>Test 3</h3>
                        <p>We love the Big Apple!</p>
                    </div>
                </div>

                <a className="carousel-control-prev" href="#demo" data-slide="prev">
                    <span className="carousel-control-prev-icon"></span>
                </a>
                <a className="carousel-control-next" href="#demo" data-slide="next">
                    <span className="carousel-control-next-icon"></span>
                </a>

            </div>
        </div>
    );
}








function EventCards(props) {

    var eventcards = [];

    for (let index = 0; index < allEvent.length; index++) {
        eventcards.push(<EventCard key={"eventcard" + index} eventid={index} target={"#targetevent" + index} />);
    }
    return eventcards;
}

function EventCard(props) {
    return (
        <div className="card text-right">
            <img className="card-img-top" src="no-img.png" alt="Card image" />
            <div className="card-body">
                <h5 className="card-title">Event: {props.eventid}</h5>
                <p className="card-text">detail of event here.</p>
                <a href="#" className="btn btn-primary" data-toggle="modal" data-target={props.target}><i className="fa fa-gear"></i> manage</a>
            </div>
        </div>
    );

}








function EventModals(props) {
    var eventmodals = [];

    for (let index = 0; index < allEvent.length; index++) {
        eventmodals.push(<EventModal key={"eventmodal" + index} eventid={index} target={"targetevent" + index} />);
    }
    return eventmodals;
}
function EventModal(props) {
    return (
        <div className="modal fade" id={props.target} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Event: {props.eventid}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>form with event detail will go here.</p>
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

// function testA() {
//     console.log("This form testA");
// }













const MyMapComponent = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA3fh0e8ySFm2m3oo1IyR9RVyAUOCu2Lx4&v=3.exp&libraries=geometry,drawing,places",
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
        markerPosition: state.positionReducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        changePosition: (position) => {
            dispatch({
                type: "CHANGE_LOCATION",
                payload: position
            })
        }
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(Event);
