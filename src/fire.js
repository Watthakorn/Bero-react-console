import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyCawfptuLTFuUub84CiMe834ISSCsrCWvs",
  authDomain: "bero-be-a-hero.firebaseapp.com",
  databaseURL: "https://bero-be-a-hero.firebaseio.com",
  projectId: "bero-be-a-hero",
  storageBucket: "bero-be-a-hero.appspot.com",
  messagingSenderId: "437431150193"
  // apiKey: "AIzaSyBJsiDQapDc0jiJZuDEck7T3O_jqIiQL2Q",
  // authDomain: "bero-react-console-c2d3b.firebaseapp.com",
  // databaseURL: "https://bero-react-console-c2d3b.firebaseio.com",
  // projectId: "bero-react-console-c2d3b",
  // storageBucket: "bero-react-console-c2d3b.appspot.com",
  // messagingSenderId: "761895550361"
};
var fire = firebase.initializeApp(config);
export default fire;
export const auth = firebase.auth
export const provider = new firebase.auth.FacebookAuthProvider();