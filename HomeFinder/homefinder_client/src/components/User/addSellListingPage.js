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
import placeHolderListingImage from '../../common/placeholder.png'
import NavbarComponent from '../LandingPage/NavbarComponent'
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";

//Define a Sell Listing Page Component 
class AddSellListing extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
           homeType:"Attached Single Family",
           sellListingDetails:[],
           flooring:"Wooden",
           parking:"Open",
           listing:[],
           users:[],
           approvalStatus:'Pending',
           applications:[]
        }
        //Bind the handlers to this class
        this.inputHandler = this.inputHandler.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeUpdateModal = this.closeUpdateModal.bind(this);
    }
    componentDidMount=()=>
    {
      this.getSellListings(); 
    }

    // User's and Realtor's sell property listings
    getSellListings = async () => {
        let user = localStorage.getItem("user_id");
        const data = { user: user }
        let result = await axios.post(backendURI + '/sell/getMySellListings', data)
        let sellListingDetails = result.data;
        console.log(sellListingDetails);
        await this.setState({ sellListingDetails });
    };
    handleListingAdd = () => {
        this.setState({ showListingModal: true });
    }
    closeModal() {
        this.setState({
            showListingModal: false,
            showDetailsModal: false,
            showOffersModal: false,
            showListingEditModal: false,
            showOpenHouseModal: false,
            imageModal: false
        });
    }
    homeTypeChange = (e) => {
        this.setState({
            homeType: e.target.value
        })
    }

    parkingChange = (e) => {
        this.setState({
            parking: e.target.value
        })
    }

    flooringChange = (e) => {
        this.setState({
            flooring: e.target.value
        })
    }

    inputHandler(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

   //Adding new sell Listing
      onListSubmit = async (e) => {
        e.preventDefault();
        const data = {
            propertyName: this.state.propertyName,
            address: this.state.address,
            zipcode: this.state.zipcode,
            flooring: this.state.flooring,
            bedroom: this.state.bedroom,
            bathroom: this.state.bathroom,
            lotsize:this.state.lotsize,
            parking:this.state.parking,
            additional:this.state.additional,
            amenities:this.state.amenities,
            homeType:this.state.homeType,
            user:localStorage.getItem("user_id"),
            sellingPrice: this.state.sellingPrice,
            area:this.state.area,
            yearBuilt:this.state.yearBuilt
        }
        console.log("data going to add listing" + JSON.stringify(data));
        //set the with credentials to true
       // axios.defaults.withCredentials = true;
        axios.post(backendURI + '/sell/addSellListing', data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        showListingModal: false
                    }); 
                    this.getSellListings();
                }
            })
            .catch(err => {
                this.setState({ errorMessage: err.response.data });
            })
    }
    //Deleting a sell listing

    handleDeletion=async(e)=>{
        await this.setState({
            listingId:e._id
     });
        const data={
           
            listingId:this.state.listingId
        }
        console.log("data going to listing deletion"+JSON.stringify(data));
        //set the with credentials to true
       // axios.defaults.withCredentials = true;
        axios.post(backendURI +'/sell/removeSellListing',data)
        .then(response => {
        if (response.status === 200) {
            console.log(response.data);
            this.setState({
                successFlagDeletion:true
            })
            this.getSellListings();
        }   
    })
    .catch(err => { 
        this.setState({errorMessage: err.response.data});
    })
}
// View Listing Details
    viewListingDetails=async(e)=>
    {
        this.setState({ showDetailsModal: true,listing:e }); 
    }

// Handle Modification of listing added by the user

    handleModification=async(e)=>
    {
        this.setState({ showListingEditModal: true,listing:e }); 
    }
// View Applications- review applications - accept/reject
viewOfferDetails=async(e)=>
{
    //this.setState({ showOffersModal: true,listing:e }); 

    
        await this.setState({ listing:e });
    
        const data = {
            listingId:this.state.listing._id
        }
        console.log("data going to add listing" + JSON.stringify(data));
        //set the with credentials to true
       // axios.defaults.withCredentials = true;
        axios.post(backendURI + '/buy/getMyBuyApplications', data)
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    let applications = response.data;
                    console.log(applications);
                    console.log(response.data.users);
                    this.setState({
                        applications,
                       
                            showOffersModal:true    
                            
                       
                    }); 
                   // this.getRentListings();
                 
                }
            })
            .catch(err => {
                this.setState({ errorMessage: "error" });
            })
    
    
}

// Add Open House
addOpenHouse=async(e)=>
{
    this.state.errorMessage="";
    this.setState({ showOpenHouseModal: true,listing:e }); 
}

onOpenHouseAdd =async(e)=>{
    e.preventDefault();
    const data = {
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        listing:this.state.listing._id,
    }
    console.log("data going to add open house" + JSON.stringify(data));
    //set the with credentials to true
   // axios.defaults.withCredentials = true;
    axios.post(backendURI + '/addOpenHouse', data)
        .then(response => {
            if (response.status === 200) {
                this.setState({ 
                    showOpenHouseModal: false
                }); 
                this.getSellListings();
            }
        })
        .catch(err => {
            this.setState({ errorMessage: err.response.data});
        })
}

//Sending modified values to backend

onListModify= async(e)=>{
    e.preventDefault();
    
    const data={
        listingId:this.state.listing._id,
        propertyName: this.state.propertyName||this.state.listing.propertyName,
        address: this.state.address||this.state.listing.address,
        zipcode: this.state.zipcode||this.state.listing.zipcode,
        flooring: this.state.flooring||this.state.listing.flooring,
        bedroom: this.state.bedroom||this.state.listing.bedroom,
        bathroom: this.state.bathroom||this.state.listing.bathroom,
        lotsize:this.state.lotsize||this.state.listing.lotsize,
        parking:this.state.parking||this.state.listing.parking,
        additional:this.state.additional||this.state.listing.additional,
        amenities:this.state.amenities||this.state.listing.amenities,
        sellingPrice: this.state.sellingPrice||this.state.listing.sellingPrice,
        area: this.state.area||this.state.listing.area,
        homeType:this.state.homeType||this.state.listing.homeType,
        yearBuilt:this.state.yearBuilt||this.state.listing.yearBuilt,
        user:localStorage.getItem("user_id")
    }
    console.log("data going to edit sell listing details"+JSON.stringify(data));
    //set the with credentials to true
   // axios.defaults.withCredentials = true;
    axios.post(backendURI +'/sell/editSellListing',data)
    .then(response => {
    if (response.status === 200) {
        console.log(response.data);
        this.setState({
            showListingEditModal: false
        });
        this.getSellListings();
    }
})
.catch(err => { 
    this.setState({errorMessage: "error"});
})   
}

  // This will close modal for approval status change 
closeUpdateModal() {
        this.setState({
            openStatus:false
        });
    }

    //This will open Modal for approval status change
openStatus(application) {
        this.setState({
            openStatus: true ,
            applicationId:application._id
                 
        });
}


//This will assign new status for the user as selected
handleStatusChange=(e)=>{
    
    this.setState({
        approvalStatus: e.target.value
    })
}
 //This will call backend to change approval status
 onUpdateStatus=(e)=>{
    e.preventDefault()
    const data={applicationId :this.state.applicationId,
                approvalStatus:this.state.approvalStatus      
    };
    axios.post(backendURI +'/buy/updateBuyApplication',data)
    .then(response => {
        console.log("Status Code : ",response.status);
        if(response.status === 200){
           
            this.setState({
                openStatus:false 
            });
            message.success('Approval Status Updated');
        }
        this.setState({
            showOffersModal:false 
        });
        
    })
    .catch(err => { 
        this.setState({errorMessage:"Approval status not updated"});
    });
}

handleImageEdit=(e)=>{
    this.setState({imageModal:true,
        listingId:e._id
    });
    
}
handleImageChange = (e) => {
    console.log(e.target.files[0])
    this.setState({
        listingImage: e.target.files[0]
    });
};

handleChangeStartDate = (date)=> {
    this.setState({
      startDate: date
    })
  }

  handleChangeEndDate = (date)=> {
    this.setState({
      endDate: date
    })
  }
onImageSubmit= async (e)=>{
    
    const image_data = new FormData()
    image_data.append('file', this.state.listingImage);
    image_data.append('listingId',this.state.listingId);
    console.log(image_data);
    axios.post(backendURI +"/sell/uploadImage",image_data)
    .then(response => {
    if (response.status === 200) {
        console.log("Image uploaded")
        this.setState({
            imageModal: false,
            imageChange:true
        });
        
    }
    this.getSellListings();
})
.catch(err => { 
    this.setState({errorMessage: "error"});
})   
}
    
    render(){
        //redirect based on successful login 
        let redirectVar = null;let navAdmin=null;let userlist;
        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />; 
        }
        else if (localStorage.getItem("user_role")=="Admin")
        {
            redirectVar = <Redirect to="/admin" />; 
        }

        return(
         <div> 
                {redirectVar}
                <NavbarComponent/>
                <div bg="dark" variant="dark">
                    <button type="button" id="ListingAdd" class="btn btn-dark btn-block pull-right" onClick={this.handleListingAdd}>Add Sell Listing</button>
                </div>
                <div class="container">
                    <div className="row mt-3"> 
                            <div class="panel panel-default">
                            </div>
                            {/*<div class="panel-footer text-right">
                                <button type="button" id="ListingAdd" class="btn btn-primary btn-block pull-right" onClick={this.handleListingAdd}>Add Sell Listing</button>
                            </div>*/}
                        </div>
                        </div>
                        {this.state.sellListingDetails.map(listing =>
                                <div key={listing._id}>
                                    <div class="panel panel-default">
                                        <div class="panel-heading"><h2>{listing.propertyName}</h2></div>
                                        <div class="panel-body">
                                        <div className="card" style={{ width: 15 + "rem" }}>
                                            {listing.imagePath?(
                                            <img className="card-img-top" src={backendURI+'/'+listing.imagePath} alt="" />)
                                            :
                                            (<img className="card-img-top" src={placeHolderListingImage} alt="" />)}
                                            <button type="button" id="picEdit" className="btn btn-dark btn-block btn-xs pull-right" onClick={() => this.handleImageEdit(listing)}>Edit Listing Picture</button>
                                    
                                        </div>
                                        <div class="panel-body">Property Name: {listing.propertyName}</div>
                                        <div class="panel-body">Address: {listing.address}</div>
                                        <div class="panel-body">Zipcode: {listing.zipcode}</div>
                                        </div>
                                    </div>
                                    <div class="panel-footer">
                                    <Button type="button"  variant="dark"  onClick={() => this.viewListingDetails(listing)}>View Details</Button>{"    "}
                                    <Button type="button"  variant="dark" onClick={() => this.handleModification(listing)}>Modify</Button>{"    "}
                                    <Button type="button"  variant="dark" onClick={() => this.viewOfferDetails(listing)}>View Offers</Button>{"    "}
                                    <Button type="button"  variant="danger"  onClick={() => this.handleDeletion(listing)}>Remove</Button>{"   "}
                                    <Button type="button"  variant="dark" onClick={() => this.addOpenHouse(listing)}>Schedule OpenHouse</Button>{"    "}
                                    
                                    </div>
                                </div>
                            )
                            }
                  

                        <Modal
                        isOpen={this.state.showListingModal}
                        onRequestClose={this.closeModal}
                        contentLabel="Sell Listing Modal" >
                        <div>
                            <form onSubmit={this.onListSubmit}>
                                <div class="container">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">Let us know more about listing you want to add: </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Property name</b></span>
                                            </div>
                                            <input type="text" size="50" name="propertyName" className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" title="Please enter a propertyname, property name cannot be spaces" required />
                                        </div>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Address</b></span>
                                            </div>
                                            <input type="text" size="50" name="address" className="form-control" aria-label="addressName" aria-describedby="basic-addon1" onChange={this.inputHandler}
                                                pattern=".*\S.*" />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Zipcode</b></span>
                                            </div>
                                            <input type="number" size="50" name="zipcode" className="form-control" aria-describedby="basic-addon1" onChange={this.inputHandler} title="Numbers only" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Lot Size</b></span>
                                            </div>
                                            <input type="text" size="50"  className="form-control" name="lotsize"  aria-describedby="basic-addon1" onChange={this.inputHandler} title="Enter lot size in sqft" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Home Type</b></span>
                                            </div>
                                            <select value={this.state.homeType} onChange={this.homeTypeChange} className="form-control" aria-label="category" aria-describedby="basic-addon1" required >
                                                <option value="AttachedSingleFamily">Attached Single Family</option>
                                                <option value="DetachedSingleFamily">Detached Single Family</option>
                                                <option value="Apartment">Apartment</option>
                                                <option value="Townhome">Townhome</option>
                                            </select>
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Bedrooms</b></span>
                                            </div>
                                            <input type="number" size="50" name="bedroom"  className="form-control"  aria-describedby="basic-addon1" onChange={this.inputHandler} title="Only Numbers" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Bathrooms</b></span>
                                            </div>
                                            <input type="number" size="50" className="form-control" name="bathroom"  aria-describedby="basic-addon1" onChange={this.inputHandler} title="Only Numbers" required />
                                        </div>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Flooring</b></span>
                                            </div>
                                            <select value={this.state.flooring} onChange={this.flooringChange} className="form-control" aria-label="category" aria-describedby="basic-addon1" required >
                                                <option value="Carpet">Carpet</option>
                                                <option value="Wooden">Wooden</option>
                                            </select>
                                        </div>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Parking</b></span>
                                            </div>
                                            <select value={this.state.parking} onChange={this.parkingChange} className="form-control" aria-label="category" aria-describedby="basic-addon1" required >
                                                <option value="Open">Open</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </div>

                                        

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Amenities</b></span>
                                            </div>
                                            <input type="text" name="amenities" size="50" className="form-control"  aria-describedby="basic-addon1" onChange={this.inputHandler} title="Add amenities in comma separated manner" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Area</b></span>
                                            </div>
                                            <input type="text" name="area" size="50" className="form-control"  aria-describedby="basic-addon1" onChange={this.inputHandler} title="Area" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Selling Price</b></span>
                                            </div>
                                            <input type="text" size="50" name="sellingPrice" className="form-control"  aria-describedby="basic-addon1" onChange={this.inputHandler} title="Selling Price" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Additional Information</b></span>
                                            </div>
                                            <input type="text" size="50" className="form-control" name="additional" aria-describedby="basic-addon1" onChange={this.inputHandler} title="Add additional information if required"/>
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Year Built</b></span>
                                            </div>
                                            <input type="text" size="50" className="form-control" name="yearBuilt" aria-describedby="basic-addon1" onChange={this.inputHandler} title="Year Built"/>
                                        </div>


                                        <center>
                                            <Button variant="dark" type="submit">
                                                <b>Add Sell Listing</b>
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
                        isOpen={this.state.showDetailsModal}
                        onRequestClose={this.closeModal}
                        contentLabel="Sell Listing Details Modal" >
                        <div>
                        <div class="panel panel-default">
                                        <div class="panel-heading">Added Listings Details</div>
                                        <div class="panel-body">
                                        <div className="card" style={{ width: 15 + "rem" }}>
                                        {this.state.listing.imagePath?(
                                            <img className="card-img-top" src={backendURI+'/'+this.state.listing.imagePath} alt="" />)
                                            :
                                            (<img className="card-img-top" src={placeHolderListingImage} alt="" />)}
                                        </div>
                                        <div class="panel-body">Property Name: {this.state.listing.propertyName}</div>
                                        <div class="panel-body">Address: {this.state.listing.address}</div>
                                        <div class="panel-body">Zipcode: {this.state.listing.zipcode}</div>
                                        <div class="panel-body">Flooring: {this.state.listing.flooring}</div>
                                        <div class="panel-body">Bedrooms: {this.state.listing.bedroom}</div>
                                        <div class="panel-body">Bathrooms: {this.state.listing.bathroom}</div>
                                        <div class="panel-body">Parking: {this.state.listing.parking}</div>
                                        <div class="panel-body">Lot Size: {this.state.listing.lotsize}</div>
                                        <div class="panel-body">Home Type: {this.state.listing.homeType}</div>
                                        <div class="panel-body">Amenities: {this.state.listing.amenities}</div>
                                        <div class="panel-body">Selling Price: {this.state.listing.sellingPrice}</div>
                                        <div class="panel-body">Area: {this.state.listing.area}</div>
                                        <div class="panel-body">Additional: {this.state.listing.additional}</div>
                                        <div class="panel-body">Year Built: {this.state.listing.yearBuilt}</div>
                                        
                                        </div>
                                        <center>
                                            <Button variant="danger" onClick={this.closeModal}>
                                                <b>Close</b>
                                            </Button>
                                        </center>
                                    </div>
                        </div>
                    </Modal>
                
                    <Modal
                            isOpen={this.state.showOffersModal}
                            onRequestClose={this.closeModal}
                            contentLabel="Sell Listing Details Modal" >
                                                    <div class="panel panel-default">
                                        <div class="panel-heading">Added Listings Details</div>
                         <form onSubmit={this.onUpdateStatus}>
                         <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Approval Status</b></span>
                                </div>
                                <select value={this.state.approvalStatus} onChange={this.handleStatusChange}  className="form-control" aria-label="category" aria-describedby="basic-addon1"  required >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Reject">Reject</option>
                                </select>
                            </div>
                            <center>
                            <Button variant="dark" type="submit">
                                    <b>Update Status</b>
                                    </Button>{" "}
                                <Button variant="primary" onClick={this.closeModal}>
                                    <b>Close</b>
                                </Button>
                            </center>
                            </form>
                            </div>
                        </Modal>

                        <Modal
                            isOpen={this.state.showOpenHouseModal}
                            onRequestClose={this.closeModal}
                            contentLabel="Open House Modal" >
                            
                        <div class="panel panel-default">
                                        <div class="panel-heading">Add Open House Details</div>
                        
                         <form onSubmit={this.onOpenHouseAdd}>
                         <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Open House Start Date</b></span>
                                </div>
                                <DatePicker
                                selected={ this.state.startDate }
                                onChange={ this.handleChangeStartDate }
                                name="startDate"
                                dateFormat="MM/dd/yyyy"
                                />
                            </div>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Open House End Date</b></span>
                                </div>
                                <DatePicker
                                selected={ this.state.endDate }
                                onChange={ this.handleChangeEndDate }
                                name="endDate"
                                dateFormat="MM/dd/yyyy"
                                />
                            </div>
                            
                        
                            <div style={{float: 'left', color: 'red'}} >
                            { this.state.errorMessage &&
                            <h5 className="error">Error: { this.state.errorMessage} </h5> }
                            </div>

                            <center>
                            <Button variant="dark" type="submit">
                                    <b>Save</b>
                                    </Button>{" "}
                                <Button variant="danger" onClick={this.closeModal}>
                                    <b>Close</b>
                                </Button>
                            </center>
                            </form>
                            </div>
                        </Modal>


                    <Modal
                        isOpen={this.state.showListingEditModal}
                        onRequestClose={this.closeModal}
                        contentLabel="Sell Listing Modal" >
                        <div>
                            <form onSubmit={this.onListModify}>
                                <div class="container">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">Let us know more about listing you want to add: </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Property name</b></span>
                                            </div>
                                            <input type="text" size="50" name="propertyName" className="form-control" aria-label="propertyname" aria-describedby="basic-addon1" onChange={this.inputHandler} pattern=".*\S.*" defaultValue={this.state.listing.propertyName} title="Please enter a propertyname, property name cannot be spaces" required />
                                        </div>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Address</b></span>
                                            </div>
                                            <input type="text" size="50" name="address" className="form-control" aria-label="addressName" aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.address}
                                                pattern=".*\S.*" />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Zipcode</b></span>
                                            </div>
                                            <input type="number" size="50" name="zipcode" className="form-control" aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.zipcode}  title="Numbers only" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Lot Size</b></span>
                                            </div>
                                            <input type="text" size="50"  className="form-control" name="lotsize"  aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.lotsize} title="Enter lot size in sqft" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Home Type</b></span>
                                            </div>
                                            <select value={this.state.homeType} onChange={this.homeTypeChange} className="form-control" aria-label="category" aria-describedby="basic-addon1" required >
                                                <option value="Attached Single Family">Attached Single Family</option>
                                                <option value="Detached Single Family">Detached Single Family</option>
                                                <option value="Apartment">Apartment</option>
                                                <option value="Townhome">Townhome</option>
                                            </select>
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Bedrooms</b></span>
                                            </div>
                                            <input type="number" size="50" name="bedroom"  className="form-control"  aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.bedroom} title="Only Numbers" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Bathrooms</b></span>
                                            </div>
                                            <input type="number" size="50" className="form-control" name="bathroom"  aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.bathroom} title="Only Numbers" required />
                                        </div>
                                        
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Flooring</b></span>
                                            </div>
                                            <select value={this.state.flooring} onChange={this.flooringChange} className="form-control" aria-label="category" aria-describedby="basic-addon1" required >
                                                <option value="Carpet">Carpet</option>
                                                <option value="Wooden">Wooden</option>
                                            </select>
                                        </div>


                                        
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Parking</b></span>
                                            </div>
                                            <select value={this.state.parking} onChange={this.parkingChange} className="form-control" aria-label="category" aria-describedby="basic-addon1" required >
                                                <option value="Open">Open</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </div>

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Amenities</b></span>
                                            </div>
                                            <input type="text" name="amenities" size="50" className="form-control"  aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.amenities} title="Add amenities in comma separated manner" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Area</b></span>
                                            </div>
                                            <input type="text" name="area" size="50" className="form-control"  aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.area} title="Area" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Selling Price</b></span>
                                            </div>
                                            <input type="text" size="50" name="sellingPrice" className="form-control"  aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.sellingPrice} title="Selling Price" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Additional Information</b></span>
                                            </div>
                                            <input type="text" size="50" className="form-control" name="additional" aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.additional} title="Add additional information if required"/>
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Year Built</b></span>
                                            </div>
                                            <input type="text" size="50" className="form-control" name="yearBuilt" aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.yearBuilt} title="Year Built"/>
                                        </div>

                                        <center>
                                            <Button variant="dark" type="submit">
                                                <b>Update Sell Listing</b>
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
                        isOpen={this.state.showOffersModal}
                        onRequestClose={this.closeModal}
                        contentLabel="Buy Application Details Modal" >
                        <div>
                        <div class="panel panel-default">
                                        <div class="panel-heading">Offer Details</div>
                                        <div class="panel-body">
                                        <div class="panel-body">Property Name: {this.state.listing.propertyName}</div>
                                        <div class="panel-body">Address: {this.state.listing.address}</div>
                                        
                                        {this.state.applications.map(application =>
                                            <div key={application._id}>
                                         <div class="panel panel-default">
    <div class="panel-heading">Name: {application.user.name}{" Email Id:   "}{application.user.emailId}</div>
                                        <div class="panel-body">

                                       
                                        <div class="panel-body">Applicant ssn: {application.ssn}</div>
                                        <div class="panel-body">offerPrice: {application.offerPrice}</div>
                                        <div class="panel-body">creditScore: {application.creditScore}</div>
                                        <div class="panel-body">address: {application.address}</div>
                                        <div class="panel-body">downPayment: {application.downPayment}</div>
                                        <div class="panel-body">Phone number: {application.phoneNumber}</div>   
                                        <div class="panel-body">Application Status: {application.approvalStatus}</div>

                                        <td><Button variant="dark" onClick={() => this.openStatus(application)}>Change Status</Button></td>
                                        
                                        </div>
                                    </div>
                                    <div class="panel-footer">
                                  
                                    
                                    </div>
                                </div>
                            )
                            }
                                        
                                        </div>
                                        <center>
                                            <Button variant="danger" onClick={this.closeModal}>
                                                <b>Close</b>
                                            </Button>
                                        </center>
                                    </div>
                        </div>
                    </Modal>


                    <Modal
                            isOpen={this.state.openStatus}
                            onRequestClose={this.closeUpdateModal}
                             contentLabel="Approval status Modal" >
                            
                         <form onSubmit={this.onUpdateStatus}>
                         <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Approval Status</b></span>
                                </div>
                                <select value={this.state.approvalStatus} onChange={this.handleStatusChange}  className="form-control" aria-label="category" aria-describedby="basic-addon1"  required >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Reject">Reject</option>
                                </select>
                            </div>
                            <center>
                            <Button variant="dark" type="submit">
                                    <b>Update Status</b>
                                    </Button>{" "}
                                <Button variant="primary" onClick={this.closeUpdateModal}>
                                    <b>Close</b>
                                </Button>
                            </center>
                            </form>
                        </Modal>



<Modal
                            isOpen={this.state.imageModal}
                            onRequestClose={this.closeModal}
                             contentLabel="Image Modal" >
                           
                           <div>
                         <form onSubmit={this.onImageSubmit} enctype="multipart/form-data">
                             
            <div class="container">
            <div class="panel panel-default">
    <div class="panel-heading">Choose photo to upload: </div>
                    <div className="input-group mb-2">
                                <input type="file" name="listing_image" accept="image/*" className="form-control" aria-label="Image" aria-describedby="basic-addon1" onChange={this.handleImageChange} />
                            </div>
                            <center>
                                <Button variant="dark" type="submit">
                                    <b>Change</b>
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
export default AddSellListing;