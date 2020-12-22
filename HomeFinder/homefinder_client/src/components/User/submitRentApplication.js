import React, {Component} from 'react';
import '../../App.css';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {backendURI} from '../../common/config';
import  {Button} from 'react-bootstrap';
import {message } from 'antd';
import 'antd/dist/antd.css';
import Modal from 'react-modal';
import NavbarComponent from '../LandingPage/NavbarComponent'
import emailjs,{ init  } from 'emailjs-com';
class SubmitRentApplication extends Component
{
    componentDidMount() {
        var listing_id = this.props.location.listing_id;
        this.setState({
            listing_id : listing_id
        })
        //console.log(this.props)
    }
    constructor(props)
    {
        super(props);
        this.state={

        }
        this.inputHandler = this.inputHandler.bind(this);
        this.closeModal = this.closeModal.bind(this);
        init("user_rSGbwG0Z6gebhqkjkMbeQ");
    }
    inputHandler(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

    // Submit Rent applications
submitRentApplication=async(e)=>
{
    this.setState({ showSubmitModal: true}); 
}

closeModal() {
    this.setState({
        showSubmitModal:false
    });
}
//Sending mail 
onApplicationSubmit = async (e) => {
    e.preventDefault();
    const data = {
        ssn: this.state.ssn,
        approvalStatus: this.state.approvalStatus,
        creditScore: this.state.creditScore,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
        securityDeposit:this.state.securityDeposit,
        employer:this.state.employer,
        employmentId:this.state.employmentId,
        user:localStorage.getItem("user_id"),
        listing: this.state.listing_id //"5fbe2eb8258fd19944618f43"
    }
    const templateId = 'template_gfqfhy6';
    console.log("data going to add application" + JSON.stringify(data));

    //set the with credentials to true
    axios.defaults.withCredentials = true;
    axios.post(backendURI + '/rentApplication/addRentApplication', data)
        .then(response => {
            if (response.status === 200) {
                this.sendFeedback(templateId, 
                    {
                        from_name: localStorage.getItem("user_name"), 
                        reply_to: "no_reply@homefinder.com",
                        phone_number: this.state.phoneNumber, 
                        from_email_address: localStorage.getItem('emailId')

                    });
                this.setState({
                    showBuyApplicationModal: false
                }); 
               // this.getSellListings();
            }
        })
        .catch(err => {
            this.setState({ errorMessage: err.response.data });
        })
}
  //send email
  sendFeedback=async(templateId, variables) =>{
    emailjs.send(
      'service_qshljyq', templateId,
      variables
      ).then(res => {
        console.log('Email successfully sent!')
      })
      // Handle errors here however you like, or use a React error boundary
      .catch(err => console.error('Oh well, you failed. Here some thoughts on the error that occured:', err))
  }
    render()
    {
        let redirectVar = null;

        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />; 
        }
        else if(localStorage.getItem("user_role")=='Admin') {
            redirectVar = <Redirect to="/admin" />; 
        }
      return(
          <div>
              {redirectVar}
              <NavbarComponent/>
              <h4>Submit rent application for a listing</h4>
              <Button type="button"  variant="dark"  onClick={() => this.submitRentApplication()}>Submit Rent Application</Button>{"    "}

              <Modal
                            isOpen={this.state.showSubmitModal}
                            onRequestClose={this.closeModal}
                             contentLabel="Example Modal" >
                           
                           <div>
                            <form onSubmit={this.onApplicationSubmit}>
                                <div class="container">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">Please fill form for submitting application: </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Name</b></span>
                                            </div>
                                            <input type="text" size="50" name="name" value={localStorage.getItem('user_name')} className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" title="Please enter your Name" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Email Address</b></span>
                                            </div>
                                            <input type="text" size="50" name="email" value={localStorage.getItem('emailId')} className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" title="Please enter your Email" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Address</b></span>
                                            </div>
                                            <input type="text" size="50" name="address" className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" title="Please enter your Address" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Credit Score</b></span>
                                            </div>
                                            <input type="text" size="50" name="creditScore" className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" title="Please enter your Credit Score" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Security Deposit</b></span>
                                            </div>
                                            <input type="text" size="50" name="securityDeposit" className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" title="Please enter your down payment amount" required />
                                        </div>
                                  
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>SSN</b></span>
                                            </div>
                                            <input type="text" size="50" name="ssn" className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" title="Please enter your SSN" required />
                                        </div>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Employment Id</b></span>
                                            </div>
                                            <input type="text" size="50" name="employmentId" className="form-control" aria-label="addressName" aria-describedby="basic-addon1" onChange={this.inputHandler}
                                                pattern=".*\S.*" />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Employer</b></span>
                                            </div>
                                            <input type="text" size="50" name="employer" className="form-control" aria-label="addressName" aria-describedby="basic-addon1" onChange={this.inputHandler}
                                                pattern=".*\S.*" />
                                        </div>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Phone Number</b></span>
                                            </div>
                                            <input type="text" size="50" name="phoneNumber" className="form-control" aria-label="phoneNumber" aria-describedby="basic-addon1" onChange={this.inputHandler}
                                                pattern=".*\S.*" />
                                        </div>
                                    
                                        <center>
                                            <Button variant="dark" type="submit">
                                                <b>Add Rent Application</b>
                                            </Button>&nbsp;&nbsp;
                                            <Button variant="danger" onClick={this.closeModal}>
                                                <b>Close</b>
                                            </Button>
                                        </center>
                                    </div>
                                </div>
                            </form>
                        </div>
                        </Modal>
                    
          </div>
      )
    }
}
export default SubmitRentApplication;