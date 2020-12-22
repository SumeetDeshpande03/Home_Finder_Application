import React from 'react';
import {Redirect} from 'react-router';
import {backendURI} from '../../common/config.js';
import { Button , Col, Container, Form , ListGroup, Table, Badge} from 'react-bootstrap';
import axios from 'axios';
import NavbarComponent from '../LandingPage/NavbarComponent'
import Modal from 'react-modal';
import {message } from 'antd';
import 'antd/dist/antd.css';
import emailjs,{ init  } from 'emailjs-com';
import First from '../../images/HomeFinder1.png'

class ViewListing extends React.Component {

    constructor(){
        super();
        this.state = {
            propertyName:'',
            address: '',
            area: '',
            zipcode: '',
            redirect: '',
            isFavorite: false
        }
        this.inputHandler = this.inputHandler.bind(this);
        this.closeModal = this.closeModal.bind(this);
        init("user_rSGbwG0Z6gebhqkjkMbeQ");
        const templateId = 'template_gfqfhy6';
    }

    submitRentApplication=async(e)=>
    {
        this.setState({ showSubmitModal: true}); 
    }

    submitBuyApplication=async(e)=>
    {
        this.setState({ showBuyApplicationModal: true}); 
    }

    submitScheduleVisit=async(e)=>
    {
        this.setState({ showScheduleModal: true}); 
    }
    closeModal() {
        this.setState({
            showSubmitModal:false,
            showScheduleModal:false,
            showBuyApplicationModal:false
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

      //Submit Buy Application
      onListSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ssn: this.state.ssn,
            offerPrice: this.state.offerPrice,
            approvalStatus: this.state.approvalStatus,
            creditScore: this.state.creditScore,
            address: this.state.buyapplicantaddress,
            phoneNumber: this.state.phoneNumber,
            downPayment: this.state.downPayment,
            user:localStorage.getItem("user_id"),
            listing: this.state.listing_id 
        }
        const buytemplateId = 'template_pu3m9js';
        console.log("data going to add application" + JSON.stringify(data));

       // axios.defaults.withCredentials = true;
        axios.post(backendURI + '/buy/addBuyApplication', data)
            .then(response => {
                if (response.status === 200) {
                    this.sendFeedback(buytemplateId, 
                        {
                        from_name: localStorage.getItem("user_name"), 
                        reply_to: "no_reply@homefinder.com",
                        phone_number: this.state.phoneNumber, 
                        from_email_address: localStorage.getItem('emailId'), 
                        to_email_address: this.state.listing_id.user.emailId,
                        to_name: this.state.listing_id.user.name,
                        from_address: this.state.buyapplicantaddress,
                        credit_score: this.state.creditScore,
                        down_payment: this.state.downPayment,
                        offer_price: this.state.offerPrice
                    });
                    this.setState({
                        showBuyApplicationModal: false,
                    }); 
                }
                //fix for success message and default to search page
                message.success('Buy Application Submitted Successfully');
            })
            .catch(err => {
                message.error(err.response.data);
                this.setState({ errorMessage: err.response.data });
            })
    }
    
      //Submitting Rent Application
    onApplicationSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ssn: this.state.ssn,
            approvalStatus: this.state.approvalStatus,
            creditScore: this.state.creditScore,
            address: this.state.applicantaddress,
            phoneNumber: this.state.phoneNumber,
            securityDeposit:this.state.securityDeposit,
            employer:this.state.employer,
            employmentId:this.state.employmentId,
            applicant:localStorage.getItem("user_id"),
            listing: this.state.listing_id
        }
        const templateId = 'template_gfqfhy6';
        console.log("data going to add application" + JSON.stringify(data));
    
        //set the with credentials to true
       // axios.defaults.withCredentials = true;
        axios.post(backendURI + '/rentApplication/addRentApplication', data)
            .then(response => {
                console.log(response.data)
                if (response.status === 200) {
                    this.sendFeedback(templateId, 
                        {
                            from_name : localStorage.getItem("user_name"), 
                            reply_to : "no_reply@homefinder.com",
                            from_address: this.state.applicantaddress,
                            phone_number: this.state.phoneNumber, 
                            credit_score: this.state.creditScore,
                            security_deposit: this.state.securityDeposit,
                            employer: this.state.employer,
                            from_email_address: localStorage.getItem('emailId'),
                            to_email_address: this.state.listing_id.user.emailId,
                            to_name: this.state.listing_id.user.name
                        });
                    this.setState({
                        showSubmitModal: false
                    }); 
                    message.success('Submitted application successfully');
                }
            })
            .catch(err => {
                this.setState({
                    showSubmitModal: false
                }); 
                message.error("User has already submitted application. Failed to submit application");
                console.log(err);
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

      //Submitting schedule date and time
      onScheduleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            schedule:this.state.schedule,
            applicant:localStorage.getItem("user_id"),
            listing: this.state.listing_id
        }
        
        console.log("data going to schedule visit" + JSON.stringify(data));
    
        //set the with credentials to true
       // axios.defaults.withCredentials = true;
        axios.post(backendURI + '/rentApplication/scheduleVisit', data)
            .then(response => {
                console.log(response.data)
                if (response.status === 200) {
                    
                    this.setState({
                        showScheduleModal: false
                    }); 
                    message.success('Scheduled visit successfully');
                }
            })
            .catch(err => {
                this.setState({
                    showScheduleModal: false
                }); 
                message.error("User has already scheduled visit for this listing. Failed to scheduled visit");
                console.log(err);
            })
    }
    onChangeHandler = e => {
        this.setState({
            [e.target.id] : e.target.value
        });
    };
    
    onSubmitHandler = e =>{ 
    }

    componentDidMount() {
        
        var propertyName = this.props.location.state.searchCard.propertyName
        var address = this.props.location.state.searchCard.address
        var area = this.props.location.state.searchCard.area;
        var zipcode = this.props.location.state.searchCard.zipcode;
        var bedrooms = this.props.location.state.searchCard.bedroom;
        var bathrooms = this.props.location.state.searchCard.bathroom;
        var flooring = this.props.location.state.searchCard.flooring;
        var parking = this.props.location.state.searchCard.parking;
        var amenities = this.props.location.state.searchCard.amenities;
        var searchType = this.props.location.state.type;
        var searchTypeDisplay = this.props.location.state.type;
        var listing_id_fav = this.props.location.state.searchCard._id

        var listing = this.props.location.state.searchCard
        if(searchType === "buy"){
            searchTypeDisplay = "Buy"
        } else {
            searchTypeDisplay = "Rent"
        }

        let isLoggedIn = false;

        if(localStorage.getItem("token")){
            isLoggedIn = true;
        }

        let user_role = localStorage.getItem("user_role");

        var idList = null
        //console.log("User ID is --> "+localStorage.getItem('user_id'))
        axios.get(backendURI+'/saveAsFavorites/getUserDetails?id='+localStorage.getItem("user_id"))
        .then(response => {
                if(response.status === 200){
                    /*if(searchType === "buy"){
                        idList = response.data.favoriteSellListings.map(x=>x._id)
                    } else{
                        idList = response.data.favoriteRentListings.map(x=>x._id)
                    }*/
                    idList = response.data.favoriteSellListings.map(x=>x._id).concat(response.data.favoriteRentListings.map(x=>x._id))
                    if(idList.includes(this.state.listing_id_fav)){
                        this.setState({
                            isFavorite: true
                        })
                    } else {
                        console.log("Not a favourite")
                    }
                }
        })

        this.setState({
            propertyName: propertyName,
            address: address,
            area: area,
            zipcode: zipcode,
            amenities : amenities,
            flooring : flooring,
            bathrooms : bathrooms,
            bedrooms : bedrooms,
            parking : parking,
            searchType : searchType,
            listing_id_fav : listing_id_fav,
            searchTypeDisplay: searchTypeDisplay,
            isLoggedIn: isLoggedIn,
            user_role: user_role,
            listing_id : listing
        })
    }

    onCancelClick = e => {
        e.preventDefault();
        var flow = this.props.location.state.flow;
        if(flow === 'Favorites'){
            this.setState({ redirect: <Redirect to='/favoriteListings' /> });
        } 
        if(flow === 'Search'){
            this.setState({ redirect: <Redirect to='/search' /> });
        }
    }
    onScheduleClick = e => {
        e.preventDefault();
        this.submitScheduleVisit()
        }


    onBuyRentClick = e => {
            e.preventDefault();
            if(this.state.searchType === "buy"){
                this.submitBuyApplication()
               // this.setState({redirect: <Redirect to={{pathname: '/buy' ,listing_id: this.state.listing_id }}/>});
            } else {

                this.submitRentApplication()
                // this.setState({redirect: <Redirect to={{pathname: '/submitRentApplication' ,listing_id: this.state.listing_id }}/>});
            }
    }

    onAddFavoriteClick = e => {
        e.preventDefault();
        const data = {
            user_id : localStorage.getItem("user_id"),
            searchType: this.state.searchType,
            listing_id: this.state.listing_id_fav
        }
        console.log(data)
        axios.post(backendURI + '/saveAsFavorites/addFav', data).then(response=>{
            if(response.status === 200){
                message.success("Added to favorites successfully")
                this.setState({
                    isFavorite: true
                })
            }
        }).catch(err => {
            alert(err.response.data);
        });
    }

    onRemoveFromFavoritesClick = e => {
        e.preventDefault();
        console.log(localStorage.getItem("user_id"))
        const data = {
            user_id : localStorage.getItem("user_id"),
            searchType: this.state.searchType,
            listing_id: this.state.listing_id_fav
        }
        axios.post(backendURI + '/saveAsFavorites/removeFav', data).then(response=>{
            if(response.status === 200){
                message.success("Removed from favorites successfully")
                this.setState({
                    isFavorite: false
                })
            }
        }).catch(err => {
            alert(err.response.data);
        });
    }

    render(){

        const isLoggedIn = this.state.isLoggedIn
        const user_role = this.state.user_role
        const isFavorite = this.state.isFavorite
        var button=null;
        var listingDetail = null;
        var extraDetails = null;
        var w = '';
        var isOpenhouse = null;
        if(this.props.location.state.searchCard.openhouseStartDate){
            var today = Date.parse(new Date().toDateString())
            var start = Date.parse(this.props.location.state.searchCard.openhouseStartDate)
            var end = Date.parse(this.props.location.state.searchCard.openhouseEndDate)
            console.log("Openhouse was scheduled for this listing")
            console.log("Start: ", start, "Today: ", today, "End:", end)
            if(start <= today && today <= end){
                isOpenhouse = (<Badge variant="success" style={{float: 'right'}}>Openhouse!!</Badge>)
            }
        }
        //set button width
        if(this.state.searchTypeDisplay!='Buy')
        {
            w = '24%'
            button=(<Button variant="dark" style={{width: w, fontSize: '100%'}} onClick={this.onScheduleClick}>
                        Schedule Visit
                    </Button>)
            extraDetails = (
            <Table striped bordered hover responsive style={{fontSize: 'medium'}}>
              <tbody>
                <tr>
                    <td width='30%'><b>Rent</b></td>
                    <td>${this.props.location.state.searchCard.price} per month</td>
                </tr>
                <tr>
                    <td width='30%'><b>Lease Term</b></td>
                    <td>{this.props.location.state.searchCard.leaseTerm}</td>
                </tr>
                <tr>
                    <td width='30%'><b>Availability Date</b></td>
                    <td>{this.props.location.state.searchCard.availabilityDate}</td>
                </tr>
                <tr>
                    <td width='30%'><b>Additional Details</b></td>
                    <td>{this.props.location.state.searchCard.additional}</td>
                </tr>
              </tbody>
            </Table>
            )
        } else {
            w = '32%'
            extraDetails = (
            <Table striped bordered hover responsive style={{fontSize: 'medium'}}>
              <tbody>
                <tr>
                    <td width='30%'><b>Selling Price</b></td>
                    <td>${this.props.location.state.searchCard.sellingPrice}</td>
                </tr>
                <tr>
                    <td width='30%'><b>Additional Details</b></td>
                    <td>{this.props.location.state.searchCard.additional}</td>
                </tr>
              </tbody>
            </Table>
            )
        }
        //Set default image
        if(this.props.location.state.searchCard.imagePath == null){
            console.log("Setting default path.")
            this.props.location.state.searchCard.imagePath = 'uploads/placeholder.png'
        }

        if(isLoggedIn && user_role!='Admin' && isFavorite){
            listingDetail = (
              <div>
                    <Button variant="dark" style={{width: w, fontSize: '100%'}} onClick={this.onBuyRentClick}>
                        Submit {this.state.searchTypeDisplay} Application
                    </Button>
                    &nbsp;
                    <Button variant="dark" style={{width: w, fontSize: '100%'}} onClick={this.onRemoveFromFavoritesClick}>
                        Remove From Favorites
                    </Button>
                    &nbsp;
                    {button}
                    &nbsp;
                    <Button variant="danger" style={{width: w, fontSize: '100%'}} onClick={this.onCancelClick}>
                        Close
                    </Button>
              </div>
            )
        } else if(isLoggedIn && user_role!='Admin' && !isFavorite){
            listingDetail = (
                <div>
                    <Button variant="dark" style={{width: w, fontSize: '100%'}} onClick={this.onBuyRentClick}>
                            Submit {this.state.searchTypeDisplay} Application
                    </Button>
                    &nbsp;
                    <Button variant="dark" style={{width: w, fontSize: '100%'}} onClick={this.onAddFavoriteClick}>
                        Add to Favorites
                    </Button>
                    &nbsp;
                    {button}
                    { (button) ? <span>&nbsp;</span> : null} {/*Add a space if it is a rent listing*/}
                    <Button variant="danger" style={{width: w, fontSize: '100%'}} onClick={this.onCancelClick}>
                        Close
                    </Button>
                </div>
            )
        } else {
            listingDetail = (
                <div>
                    <Button variant="danger" style={{width: '100%', fontSize: 12}} onClick={this.onCancelClick}>
                        Cancel
                    </Button>
                </div>
            )
        }

        return (
            <div>
                <NavbarComponent/>
                <Container>
                    {this.state.redirect}
                    <br/>
                    <center>
                        <h1 bg="dark" variant="dark">
                            {this.state.propertyName}
                            {isOpenhouse}
                        </h1>
                    </center>
                    <br/>
                    <br/>
                    {/*<ListGroup style={{fontSize: 16}}>
                        <ListGroup.Item>Address : {this.state.address}</ListGroup.Item>
                        <ListGroup.Item>Area : {this.state.area} sq. ft.</ListGroup.Item>
                        <ListGroup.Item>Zipcode : {this.state.zipcode}</ListGroup.Item>
                        <ListGroup.Item>Amenities : {this.state.amenities}</ListGroup.Item>
                        <ListGroup.Item>Flooring : {this.state.flooring}</ListGroup.Item>
                        <ListGroup.Item>#Bedrooms : {this.state.bedrooms}</ListGroup.Item>
                        <ListGroup.Item>#Bathrooms : {this.state.bathrooms}</ListGroup.Item>
                        <ListGroup.Item>Parking : {this.state.parking}</ListGroup.Item>
                    </ListGroup>*/}
                    <Table striped bordered hover responsive style={{fontSize: 'medium'}}>
                      <tbody>
                        <tr>
                          <td width='30%'><b>Address</b></td>
                          <td>{this.state.address}</td>
                        </tr>
                        <tr>
                          <td width='30%'><b>Zipcode</b></td>
                          <td>{this.state.zipcode}</td>
                        </tr>
                        <tr>
                          <td width='30%'><b>Area</b></td>
                          <td>{this.state.area} sq. ft.</td>
                        </tr>
                        <tr>
                            <td width='30%'><b>Lot Size</b></td>
                            <td>{this.props.location.state.searchCard.lotsize} sq. ft.</td>
                        </tr>
                        <tr>
                          <td width='30%'><b>Home Type</b></td>
                          <td>{this.props.location.state.searchCard.homeType}</td>
                        </tr>
                        <tr>
                          <td width='30%'><b>Amenities</b></td>
                          <td>{this.state.amenities}</td>
                        </tr>
                        <tr>
                          <td width='30%'><b>Flooring</b></td>
                          <td>{this.state.flooring}</td>
                        </tr>
                        <tr>
                          <td width='30%'><b>Bedrooms</b></td>
                          <td>{this.state.bedrooms}</td>
                        </tr>
                        <tr>
                          <td width='30%'><b>Bathrooms</b></td>
                          <td>{this.state.bathrooms}</td>
                        </tr>
                        <tr>
                          <td width='30%'><b>Parking</b></td>
                          <td>{this.state.parking}</td>
                        </tr>
                        <tr>
                            <td width='30%'><b>Year Built</b></td>
                            <td>{this.props.location.state.searchCard.yearBuilt}</td>
                        </tr>
                      </tbody>
                    </Table>
                    {extraDetails}
                    {listingDetail}
                    <br/>
                    <br/>
                    <center><h1>Images for {this.state.propertyName}</h1></center>
                    <br/>
                    <img style={{width: '100%'}} src={backendURI+'/'+this.props.location.state.searchCard.imagePath} alt='Something went wrong!'/>
                </Container>
                {/* <Container>
                    {button}
                </Container> */}
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
                                            <input type="text" size="50" name="applicantaddress" className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" title="Please enter your Address" required />
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

                        <Modal
                            isOpen={this.state.showScheduleModal}
                            onRequestClose={this.closeModal}
                             contentLabel="Example Modal" >
                           
                         
                        
                           <div>
                            <form onSubmit={this.onScheduleSubmit}>
                                <div class="container">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">Please select date for scheduling visits: </div>
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
                                                <span className="input-group-text" id="basic-addon1"><b>Schedule date and time</b></span>
                                            </div>
                                            <input type="datetime-local" size="50" name="schedule" className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" title="Please enter Date and time" required />
                                        </div>
                                       
                                        
                                        <center>
                                            <Button variant="dark" type="submit">
                                                <b>Schedule Visit</b>
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
                                            <input type="text" size="50" name="buyapplicantaddress" className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" title="Please enter your Address" required />
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
                                        <center>
                                            <Button variant="dark" type="submit">
                                                    <b>Add Buy Application</b>
                                            </Button>&nbsp;&nbsp;
                                            <Button bg="dark" variant="danger" onClick={this.closeModal}>
                                                <b>Close</b>
                                            </Button>
                                        </center>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal>
            </div>
        );
    }
}

export default ViewListing;
