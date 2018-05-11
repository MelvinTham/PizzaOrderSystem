import React, {Component} from 'react';
import './ManagerHome.css';
import * as firebase from 'firebase'
import {Avatar,
        Button,
        Divider,
        Snackbar,
        TextField,
        Typography } from 'material-ui';
import Logout from 'material-ui-icons/ExitToApp';
import User from 'material-ui-icons/Face';

class ManagerHome extends Component{
  constructor(props) {
        super(props);
        this.state = {
            user:{
                displayName:'',
                profilePicture:'',
                uid: ''
            },
            workers: [],
            showDetails:false,
            selectedIndex: null,
            processing: false,
            notify: false,
            notifyMessage: '',
            step1complete: false,
            selectedShop: null,
        };
        this.fireBaseListener = null;
        this.authListener = this.authListener.bind(this);
        this.getCookDeliverer = this.getCookDeliverer.bind(this);
    }

    getCookDeliverer() {
        var previousWorkers = this.state.workers;
        firebase.database().ref().child(`Users/`).on('value',(snap) => {
            var shopID = snap.child(`${this.state.user.uid}/shop`).val();
            firebase.database().ref(`Shops/${shopID}/cook`).on('value', (snap) => {
                // previousWorkers.push({
                //     cookID: snap.val()
                // })
                firebase.database().ref(`Shops/${shopID}/deliverer`).on('value', (snapshot) => {
                    previousWorkers.push({
                        cookID: snap.val(),
                        managerID: snapshot.val()
                    })
                    this.setState({
                        workers: previousWorkers
                    })
                })
            })
        });
        console.log(this.state.workers);
    }



    componentDidMount(){
        this.authListener();
     }

     componentWillUnmount(){
      this.fireBaseListener && this.fireBaseListener();
      this.authListener = undefined;
     }

     authListener(){
         this.fireBaseListener = firebase.auth().onAuthStateChanged((user) =>{
            if(user){
                firebase.database().ref(`Users/${user.uid}/`).once('value',
                    (snap) =>{
                        this.setState({
                            user: {
                                displayName: user.displayName,
                                profilePicture: user.photoURL,
                                uid: user.uid
                            }
                        })
                        this.getCookDeliverer();
                    })
                }
            })
        }

        render() {
            return(
                <div style={{padding:'50px 200px'}}>
                {/*=============WELCOME USER HEADER=============*/}
                <div className ="manager-header">
                    <Avatar className="manager-avatar"
                        src={this.state.user.profilePicture} />
                        <Typography variant="display2" style={{flex:1}}>
                            Welcome, {this.state.user.displayName}
                            <Button style={{float:'right'}} onClick={()=>{firebase.auth().signOut();}}>
                            <Logout style ={{marginRight: '5px'}}/> Signout
                            </Button>
                        </Typography>
                </div>
                <Divider />
            </div>
        );
  }
}
export default ManagerHome;
