import React, { Component } from 'react';
import fire from '../../fire';
import '../../css/bero.css';


class FirstPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            users: []
        }; // <- set up react state
    }




    componentWillMount() {
        /* Create reference to messages in Firebase Database */
        let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
        messagesRef.on('child_added', snapshot => {
            /* Update React state when message is added at Firebase Database */
            let message = { text: snapshot.val(), id: snapshot.key };
            this.setState({ messages: [message].concat(this.state.messages) });
        });

        var usersRef = fire.database().ref('users');

        usersRef.on('child_added', snap => {
            let user = { id: snap.key, data: snap.val() }
            this.setState({ users: [user].concat(this.state.users) });
            console.log(snap.val());
        });
    }
    addMessage(e) {
        e.preventDefault(); // <- prevent form submit from reloading the page
        /* Send the message to Firebase */
        fire.database().ref('messages').push(this.inputEl.value);
        this.inputEl.value = ''; // <- clear the input
    }
    render() {
        return (
            <div>
                <form onSubmit={this.addMessage.bind(this)}>
                    <input type="text" ref={el => this.inputEl = el} />
                    <input type="submit" />
                </form>

                <ul>
                    { /* Render the list of messages */
                        this.state.messages.map(message => <li key={message.id}>{message.id} {message.text}</li>)
                    }
                </ul>

                <ul>
                    {
                        this.state.users.map(user => <li key={user.id}>{user.id}<br /> {JSON.stringify(user.data)}</li>)
                    }
                </ul>
                <TestAdd testsend={this.state.users} />

            </div>
        );
    }
}

function TestAdd(params) {
    var user = params.testsend;
    var users = [];
    for (let index = 0; index < user.length; index++) {
        users.push(<h1 key={user[index].id}>Test {user[index].data.Profile.displayName}</h1>)

    }
    return users;

}


export default FirstPage;
