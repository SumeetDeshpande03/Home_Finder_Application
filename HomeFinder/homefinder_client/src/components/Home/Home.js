import React, {Component} from 'react';
import '../../App.css';
import {Redirect} from 'react-router';


//Define a Signup Component
class Home extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
       
        //Bind the handlers to this class
       
    }
       //username change handler to update state variable with the text entered by the user
    
    render(){
        //redirect based on successful login
        let redirectVar = null;
        return(
         <div>
            <h1>Home</h1>
        </div>
        )
    }
}
export default Home;