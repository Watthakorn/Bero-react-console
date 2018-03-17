import React, { Component } from 'react';
import '../../css/bero.css';


var allEvent = [0, 1, 2, 3, 4]

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
        this.state = { file: '', imagePreviewUrl: 'no-img.png' };
    }

    _handleSubmit(e) {
        e.preventDefault();
        // TODO: do something with -> this.state.file
        console.log('handle uploading-', this.state.file);
    }

    _handleImageChange(e) {
        e.preventDefault();

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
    createEvent(e) {

    }

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
                            <form>
                                <div className="modal-body">
                                    <div className="form-row">
                                        <div className="form-group col-12">

                                            <label htmlFor="imgInp">Image :</label>

                                            <input type="file" id="imgInp" onChange={(e) => this._handleImageChange(e)} />

                                            <img id="img-upload" src={imagePreviewUrl} className="mx-auto d-block" alt="Image" width="900" height="400" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        {/* <!-- Form Input --> */}
                                        <div className="form-group col-lg-6">

                                            <div className="form-row">
                                                <div className="form-group col-sm-8">
                                                    <label htmlFor="eventName">Event Name</label>
                                                    <input type="text" className="form-control" id="eventName" />
                                                </div>
                                                <div className="form-group col-sm-4">
                                                    <label htmlFor="inputParticipant">Participant</label>
                                                    <input type="number" id="inputParticipant" className="form-control" min="1" />
                                                </div>
                                            </div>
                                            {/* <!-- datepicker not working will use datepicker.js instead --> */}
                                            <div className="form-row">
                                                <div className="form-group col-sm-6">
                                                    <label htmlFor="start-date">Start</label>
                                                    <input className="form-control" type="date" id="start-date" />
                                                </div>
                                                <div className="form-group col-sm-6">
                                                    <label htmlFor="end-date">End</label>
                                                    <input className="form-control" type="date" id="end-date" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="detail-text">Detail</label>
                                                <textarea className="form-control" id="detail-text"></textarea>
                                            </div>
                                        </div>
                                        {/* <!-- Form map --> */}
                                        <div className="form-group col-lg-6">
                                            <label htmlFor="mapEvent">Position</label>
                                            <div id="mapEvent">My map will go here</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary"> Create</button>
                                </div>
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

// function CreateEventModal(props) {
//     return (
//         ""
//     );

// }



export default Event;
