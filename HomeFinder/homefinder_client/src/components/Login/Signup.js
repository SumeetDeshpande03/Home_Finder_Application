import React, {Component} from 'react';
import '../../App.css';
import {Redirect} from 'react-router';
import {Button ,Container,Form } from 'react-bootstrap';
import axios from 'axios';
import {backendURI} from '../../common/config.js';
import NavbarComponent from '../LandingPage/NavbarComponent'

class Signup extends Component{
    
    constructor(){
        super();
        this.state = {
            name : '',
            emailId : '',
            password :'',
            role : 'User',
            approvalStatus :'',
            successFlag :false,
            errorMessage:''
        }  
    }
    
    onChangeHandler = e => {
        this.setState({
            [e.target.id] : e.target.value
        });
    };

    onSubmitHandler = e =>{
        if(this.state.name==='' || this.state.emailId==='' || this.state.password==='' || this.state.role===''){
            alert("Please fill all the form details before submitting")
        } else{
            e.preventDefault();

            const data = {
                name : this.state.name,
                emailId : this.state.emailId,
                password : this.state.password,
                role: this.state.role
            }

            console.log(data);

            axios.post(backendURI+'/signUp',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        successFlag : true
                    })
                    alert("Signed up successfully!!Login Now!");
                }
            })
            .catch(err => { 
                this.setState({errorMessage: err.response.data});
            });
        }
    }

    render(){
        let redirectVar = null;
        if(this.state.successFlag)
        {
            redirectVar = <Redirect to= "/login"/> 
        }
        return(
            <div style={{fontSize: 13}}>
                {redirectVar}
                <NavbarComponent/>
                <Container>
                    <br/>
                    <h2>Register to Home Finder:</h2>
                    <div style={{float: 'left', color: 'red'}} >
                            { this.state.errorMessage &&
                            <h5 className="error">Error: { this.state.errorMessage} </h5> }
                            </div>
                    <br/>
                    <br/>
                    <Form onSubmit={this.onSubmitHandler}>                    
                        <Form.Group>
                            <Form.Label>Name: </Form.Label>
                            <Form.Control id="name" 
                                        value={this.state.name} 
                                        onChange={this.onChangeHandler} 
                                        placeholder="Enter Name"
                                        required/>
                        </Form.Group>
                        <br/>
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
                        <Form.Group>
                            <Form.Label>Role:</Form.Label>
                            <Form.Control id="role" size="sm" as="select"
                                value={this.state.role}
                                onChange={this.onChangeHandler} >
                            <option>User</option>
                            <option>Realtor</option>
                            </Form.Control>
                        </Form.Group>
                        <br/>
                        <Button variant="dark" onClick={this.onSubmitHandler}>
                            Sign Up
                        </Button>
                    </Form>
                </Container> 
            </div>
        );
    }
}

export default Signup;