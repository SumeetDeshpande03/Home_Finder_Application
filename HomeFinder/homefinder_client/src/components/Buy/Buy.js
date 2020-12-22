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
import emailjs,{ init  } from 'emailjs-com';
import NavbarComponent from '../LandingPage/NavbarComponent'

//Define a Buy Application Page Component 
class AddBuyApplication extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //Bind the handlers to this class
        this.inputHandler = this.inputHandler.bind(this);
        this.closeModal = this.closeModal.bind(this);
        init("user_rSGbwG0Z6gebhqkjkMbeQ");
        this.state={

        }
    }
    componentDidMount=()=>
    {
        var listing_id = this.props.location.listing_id._id;
        var sellerName = this.props.location.listing_id.user.name;
        var sellerEmail = this.props.location.listing_id.user.emailId;

        this.setState({
            listingid : listing_id,
            sellerEmail: sellerEmail,
            sellerName: sellerName
        })
    }

    handleBuyApplicationAdd = () => {
        this.setState({ showBuyApplicationModal: true });
    }
    closeModal() {
        this.setState({
            showBuyApplicationModal: false,
            showDetailsModal: false,
            showListingEditModal: false,
        });
    }

    inputHandler(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

   //Adding new buy application
      onListSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ssn: this.state.ssn,
            offerPrice: this.state.offerPrice,
            approvalStatus: this.state.approvalStatus,
            creditScore: this.state.creditScore,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            downPayment: this.state.downPayment,
            user:localStorage.getItem("user_id"),
            listing: this.state.listingid //"5f96319b2e77dd4faf14f9e9"
        }
        const templateId = 'template_pu3m9js';
        console.log("data going to add application" + JSON.stringify(data));

        axios.defaults.withCredentials = true;
        axios.post(backendURI + '/buy/addBuyApplication', data)
            .then(response => {
                if (response.status === 200) {
                    this.sendFeedback(templateId, 
                        {
                        from_name: localStorage.getItem("user_name"), 
                        reply_to: "no_reply@homefinder.com",
                        phone_number: this.state.phoneNumber, 
                        from_email_address: localStorage.getItem('emailId'), 
                        to_email_address: this.state.sellerEmail,
                        to_name: this.state.sellerName,
                        from_address: this.state.address,
                        credit_score: this.state.creditScore,
                        down_payment: this.state.downPayment,
                        offer_price: this.state.offerPrice
                    });
                    this.setState({
                        showBuyApplicationModal: false,
                        redirect: <Redirect to='/search' />
                    }); 
                }
                //fix for success message and default to search page
                message.success('Buy Application Submitted Successfully');
            })
            .catch(err => {
                message.failure(err.response.data);
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
    
    render(){
        //redirect based on successful login 
        let redirectVar = null;let navAdmin=null;let userlist;

        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />; 
        } else if(localStorage.getItem("user_role")==='Admin') {
            redirectVar = <Redirect to="/admin" />; 
        } else{
            redirectVar =this.state.redirect;
        }
        
        return(
         <div> 
                {redirectVar}
                <NavbarComponent/>
                <div class="container">
                    <div className="row mt-3"> 
                            <div class="panel panel-default">
                            </div>
                            <div class="panel-footer text-right">
                                <button type="button" id="ListingAdd" class="btn btn-primary btn-block pull-right" onClick={this.handleBuyApplicationAdd}>Submit Buy Application</button>
                            </div>
                        </div>
                        </div>

                        <Modal
                        isOpen={this.state.showBuyApplicationModal}
                        onRequestClose={this.closeModal}
                        contentLabel="Submit Application Modal" >
                        <div>
                            <form onSubmit={this.onListSubmit}>
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
                                                <span className="input-group-text" id="basic-addon1"><b>Down Payment</b></span>
                                            </div>
                                            <input type="text" size="50" name="downPayment" className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" title="Please enter your down payment amount" required />
                                        </div>
                                  
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>SSN</b></span>
                                            </div>
                                            <input type="text" size="50" name="ssn" className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" title="Please enter your SSN" required />
                                        </div>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Offer Price</b></span>
                                            </div>
                                            <input type="text" size="50" name="offerPrice" className="form-control" aria-label="addressName" aria-describedby="basic-addon1" onChange={this.inputHandler}
                                                pattern=".*\S.*" />
                                        </div>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Phone Number</b></span>
                                            </div>
                                            <input type="text" size="50" name="phoneNumber" className="form-control" aria-label="phoneNumber" aria-describedby="basic-addon1" onChange={this.inputHandler}
                                                pattern=".*\S.*" />
                                        </div>
                                        <div style={{float: 'left', color: 'red'}} >
                            { this.state.errorMessage &&
                            <h5 className="error">Error: { this.state.errorMessage} </h5> }
                            </div>
                                        <center>
                                            <Button variant="primary" type="submit">
                                                <b>Add Buy Application</b>
                                            </Button>&nbsp;&nbsp;
                                            <Button variant="secondary" onClick={this.closeModal}>
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
export default AddBuyApplication;