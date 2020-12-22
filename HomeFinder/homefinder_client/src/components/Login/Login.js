import React, {Component} from 'react';
import '../../App.css';
import {Redirect} from 'react-router';
import {Button ,Container,Form } from 'react-bootstrap';
import axios from 'axios';
import {backendURI} from '../../common/config.js';
import api from '../../common/api';
import jwtDecode from 'jwt-decode';
import NavbarComponent from '../LandingPage/NavbarComponent'


class Login extends Component{
    
    constructor(){
        super();
        this.state = {
            emailId : '',
            password :'',
            authFlag: false,
            errorMessage: ''
        }  
    }

    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    
    onChangeHandler = e => {
        this.setState({
            [e.target.id] : e.target.value
        });
    };

    onSubmitHandler = e =>{
        if(this.state.emailId==='' || this.state.password===''){
            alert("Please fill all the form details before submitting")
        } else{
            e.preventDefault();

            const data = {
                emailId : this.state.emailId,
                password : this.state.password
            }

            axios.post(backendURI +'/login',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    const token=response.data;
                    api.setJwt(token);
                    localStorage.setItem("token", token);
                    const authToken = localStorage.getItem("token");
                    const jwt = authToken.split(" ")[1]
                    let user = jwtDecode(jwt);
                    console.log(user);
                    if (user) {
                        localStorage.setItem("emailId", user.emailId);
                        localStorage.setItem("user_id", user._id);
                        localStorage.setItem("user_name", user.name);
                        localStorage.setItem("user_role", user.role);
                    }
                this.setState({
                    authFlag : true
                })  
            }
            })
            .catch(err => { 
                this.setState({errorMessage: err.response.data});
            });

        }
    }

    render(){

        let redirectVar = null;
        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />; 
        }
        else if(localStorage.getItem("user_role")==='Admin') {
            redirectVar = <Redirect to="/admin" />; 
        }
        else{
            redirectVar = <Redirect to="/search" />;
        }
        if(this.state.authFlag&&(localStorage.getItem("user_role")==='Admin'))
        {
            redirectVar = <Redirect to="/admin" />; 

        }
        else if(this.state.authFlag)
        {
            redirectVar = <Redirect to="/search" />; 

        }
        return(
            <div style={{fontSize: 13}}>
                {redirectVar}
                <NavbarComponent/>
                <Container>
                    <br/>
                    <h2>Login to Home Finder:</h2>
                    <div style={{float: 'left', color: 'red'}} >
                            { this.state.errorMessage &&
                            <h5 className="error">Error: { this.state.errorMessage} </h5> }
                            </div>
                    <br/>
                    <br/>
                    <Form onSubmit={this.onSubmitHandler}>                    
                        <Form.Group>
                            <Form.Label>Email Id:</Form.Label>
                            <Form.Control id="emailId" type="email"
                                        value={this.state.emailId} 
                                        onChange={this.onChangeHandler} 
                                        placeholder="Enter Email Id"
                                        required/>
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label>Password:</Form.Label>
                            <Form.Control id="password" type="password"
                                        value={this.state.password} 
                                        onChange={this.onChangeHandler} 
                                        placeholder="Enter Password" 
                                        required/>
                        </Form.Group>
                        <br/>
                        <Button variant="dark" onClick={this.onSubmitHandler}>
                            Login
                        </Button>
                    </Form>
                </Container> 
            </div>
        );
    }
}

export default Login;