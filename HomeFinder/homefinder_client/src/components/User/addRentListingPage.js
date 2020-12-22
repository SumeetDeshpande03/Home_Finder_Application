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
import listingImagePlace from '../../common/placeholder.png'
import NavbarComponent from '../LandingPage/NavbarComponent'

//Define a Admin Landing Page Component with All user list in the system
class AddRentListing extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
           homeType:"Attached Single Family",
            flooring:"Wooden",
            parking:"Open",
           rentListingDetails:[],
           listing:[],
           applications:[],
           users:[],
           visits:[],
           approvalStatus:'Pending'
        }
        //Bind the handlers to this class
        this.inputHandler = this.inputHandler.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeUpdateModal = this.closeUpdateModal.bind(this);
    }
    componentDidMount=()=>
    {
      this.getRentListings(); 
    }

    // User's and Realtor's rental property listings
    getRentListings = async () => {
        let user = localStorage.getItem("user_id");
        //let user = "5f8350d39bd6a608aae08c11";
        const data = { user: user }
        let result = await axios.post(backendURI + '/rent/getMyRentListings', data)
        let rentListingDetails = result.data;
        console.log(rentListingDetails);
        await this.setState({ rentListingDetails });

    };
    handleListingAdd = () => {
        this.setState({ showListingModal: true });
    }
    closeModal() {
        this.setState({
            showListingModal: false,
            showDetailsModal: false,
            showListingEditModal: false,
            imageModal:false,
            showApplicationModal:false,
            showVisitModal:false


        });
    }
    homeTypeChange = (e) => {
        this.setState({
            homeType: e.target.value
        })
    }
    flooringTypeChange = (e) => {
        this.setState({
            flooring: e.target.value
        })
    }
    parkingTypeChange = (e) => {
        this.setState({
            parking: e.target.value
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

      
   //Adding new rental Listing
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
            availabilityDate:this.state.availabilityDate,
            leaseTerm:this.state.leaseTerm,
            homeType:this.state.homeType,
            price:this.state.price,
            area:this.state.area,
            yearBuilt:this.state.yearBuilt,
            user:localStorage.getItem("user_id")
        }
        console.log("data going to add listing" + JSON.stringify(data));
        //set the with credentials to true
      //  axios.defaults.withCredentials = true;
        axios.post(backendURI + '/rent/addRentListing', data)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        showListingModal: false
                    }); 
                    this.getRentListings();
                }
            })
            .catch(err => {
                this.setState({ errorMessage: "error" });
            })
    }
    //Deleting a rent llisting

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
        axios.post(backendURI +'/rent/removeRentListing',data)
        .then(response => {
        if (response.status === 200) {
            console.log(response.data);
            this.setState({
                successFlagDeletion:true
            })
            this.getRentListings();
        }   
    })
    .catch(err => { 
        this.setState({errorMessage: "error"});
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
// View Applications
viewListingDetails=async(e)=>
{
    this.setState({ showDetailsModal: true,listing:e }); 
}

viewApplication=async(e)=>
{
    await this.setState({ listing:e });

    const data = {
        listingId:this.state.listing._id
    }
    console.log("data going to add listing" + JSON.stringify(data));
    //set the with credentials to true
  //  axios.defaults.withCredentials = true;
    axios.post(backendURI + '/rentApplication/getRentApplications', data)
        .then(response => {
            if (response.status === 200) {
                let applications = response.data;
                console.log(applications);
                console.log(response.data.users);
                this.setState({
                    applications,
                   
                        showApplicationModal:true    
                        
                   
                }); 
               // this.getRentListings();
             
            }
        })
        .catch(err => {
            this.setState({ errorMessage: "error" });
        })

}
//View visits scheduled

viewVisitsScheduled=async(e)=>
{
    await this.setState({ listing:e });

    const data = {
        listingId:this.state.listing._id
    }
    console.log("data going to view visits" + JSON.stringify(data));
    //set the with credentials to true
  //  axios.defaults.withCredentials = true;
    axios.post(backendURI + '/rentApplication/getVisitScheduled', data)
        .then(response => {
            if (response.status === 200) {
                let visits = response.data;
               
                this.setState({
                    visits,
                   
                        showVisitModal:true    
                        
                   
                }); 
             
             
            }
        })
        .catch(err => {
            this.setState({ errorMessage: "error" });
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
        availabilityDate:this.state.availabilityDate||this.state.listing.availabilityDate,
        leaseTerm:this.state.leaseTerm||this.state.listing.leaseTerm,
        homeType:this.state.homeType||this.state.listing.homeType,
        price:this.state.price||this.state.listing.price,
        area:this.state.area||this.state.listing.area,
        yearBuilt:this.state.yearBuilt||this.state.listing.yearBuilt,
        user:localStorage.getItem("user_id")
    }
    console.log("data going to edit rent listing details"+JSON.stringify(data));
    //set the with credentials to true
  //  axios.defaults.withCredentials = true;
    axios.post(backendURI +'/rent/editRentalListing',data)
    .then(response => {
    if (response.status === 200) {
        console.log(response.data);
        this.setState({
            showListingEditModal: false
        });
        this.getRentListings();
    }
})
.catch(err => { 
    this.setState({errorMessage: "error"});
})   
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
onImageSubmit= async (e)=>{
    
    const image_data = new FormData()
    image_data.append('file', this.state.listingImage);
    image_data.append('listingId',this.state.listingId);
    console.log(image_data);
    axios.post(backendURI +"/rent/uploadImage",image_data)
    .then(response => {
    if (response.status === 200) {
        console.log("Image uploaded")
        this.setState({
            imageModal: false,
            imageChange:true
        });
        
    }
    this.getRentListings();
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
        axios.post(backendURI +'/rentApplication/updateRentApplication',data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
               
                this.setState({
                    openStatus:false 
                });
                message.success('Approval Status Updated');
            }
            this.setState({
                showApplicationModal:false 
            });
            
        })
        .catch(err => { 
            this.setState({errorMessage:"Approval status not updated"});
        });
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
                <div>
                    <button bg="dark" variant="dark" type="button" id="ListingAdd" class="btn btn-dark btn-block pull-right" onClick={this.handleListingAdd}>Add Rent Listing</button>
                </div>
                <div class="container">
                    <div className="row mt-3">
                            <div class="panel panel-default">
                            </div>
                            {/*<div class="panel-footer text-right">
                                <button type="button" id="ListingAdd" class="btn btn-primary btn-block pull-right" onClick={this.handleListingAdd}>Add Rent Listing</button>
                            </div>*/}
                        </div>
                        </div>
                        {this.state.rentListingDetails.map(listing =>
                                <div key={listing._id}>
                                    <div class="panel panel-default">
                                        <div class="panel-heading"><h2>{listing.propertyName}</h2></div>
                                        <div class="panel-body">
                                        <div className="card" style={{ width: 15 + "rem" }}>
                                            {listing.imagePath?(
                                            <img className="card-img-top" src={backendURI+'/'+listing.imagePath} alt="" />)
                                            :
                                            (<img className="card-img-top" src={listingImagePlace} alt="" />)}
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
                                    <Button type="button"  variant="dark" onClick={() => this.viewApplication(listing)}>View Applications</Button>{"    "}
                                    <Button type="button"  variant="dark" onClick={() => this.viewVisitsScheduled(listing)}>View Visits Scheduled</Button>{"    "}
                                    <Button type="button"  variant="danger"  onClick={() => this.handleDeletion(listing)}>Remove</Button>{"   "}
                                    
                                    </div>
                                </div>
                            )
                            }
                  

                        <Modal
                        isOpen={this.state.showListingModal}
                        onRequestClose={this.closeModal}
                        contentLabel="Rent Listing Modal" >
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
                                            <input type="number" size="50"  className="form-control" name="lotsize"  aria-describedby="basic-addon1" onChange={this.inputHandler} title="Enter lot size in sqft. Number only" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Area</b></span>
                                            </div>
                                            <input type="number" size="50"  className="form-control" name="area"  aria-describedby="basic-addon1" onChange={this.inputHandler} title="Enter area in sqft. Number only" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Year Built</b></span>
                                            </div>
                                            <input type="number" size="50"  className="form-control" name="yearBuilt"  aria-describedby="basic-addon1" onChange={this.inputHandler} title="Enter built year. Number only" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Rent Price per month</b></span>
                                            </div>
                                            <input type="number" size="50"  className="form-control" name="price"  aria-describedby="basic-addon1" onChange={this.inputHandler} title="Enter rent price in USD per month. Number only" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Home Type</b></span>
                                            </div>
                                            <select value={this.state.homeType} onChange={this.homeTypeChange} className="form-control" aria-label="category" aria-describedby="basic-addon1" required >
                                                <option value="Attached Single Family">Attached Single Family</option>
                                                <option value="Detached Single Family">Detached Single Family</option>
                                                <option value="Townhome">Townhome</option>
                                                <option value="Apartment">Apartment</option>
                                                
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
                                        {/* <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Flooring</b></span>
                                            </div>
                                            <input type="text" name="flooring" size="50"  className="form-control" aria-describedby="basic-addon1" onChange={this.inputHandler} title="Mention flooring type" required />
                                        </div> */}

                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Flooring Type</b></span>
                                            </div>
                                            <select value={this.state.flooring} onChange={this.flooringTypeChange} className="form-control" aria-label="category" aria-describedby="basic-addon1" required >
                                                <option value="Wooden">Wooden</option>
                                                <option value="Carpet">Carpet</option>
                                                {/* <option value="both">Both</option> */}
                                            </select>
                                        </div>

                                        {/* <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Parking</b></span>
                                            </div>
                                            <input type="text" name="parking" size="50"  className="form-control" aria-describedby="basic-addon1" onChange={this.inputHandler} title="Parking Type" required />
                                        </div> */}
                                         <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Parking</b></span>
                                            </div>
                                            <select value={this.state.parking} onChange={this.parkingTypeChange} className="form-control" aria-label="category" aria-describedby="basic-addon1" required >
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
                                                <span className="input-group-text" id="basic-addon1"><b>Lease Terms</b></span>
                                            </div>
                                            <input type="text" name="leaseTerm" size="50" className="form-control"  aria-describedby="basic-addon1" onChange={this.inputHandler} title="Mention Lease terms" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Availability Date</b></span>
                                            </div>
                                            <input type="date" size="50" name="availabilityDate" className="form-control"  aria-describedby="basic-addon1" onChange={this.inputHandler} title="Date from which property is available" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Additional Information</b></span>
                                            </div>
                                            <input type="text" size="50" className="form-control" name="additional" aria-describedby="basic-addon1" onChange={this.inputHandler} title="Add additional information if required"/>
                                        </div>


                                        <center>
                                            <Button variant="dark" type="submit">
                                                <b>Add Rent Listing</b>
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
                        contentLabel="Rent Listing Destails Modal" >
                        <div>
                        <div class="panel panel-default">
                                        <div class="panel-heading">Added Listings Details</div>
                                        <div class="panel-body">
                                        <div className="card" style={{ width: 15 + "rem" }}>
                                        {this.state.listing.imagePath?(
                                            <img className="card-img-top" src={backendURI+'/'+this.state.listing.imagePath} alt="" />)
                                            :
                                            (<img className="card-img-top" src={listingImagePlace} alt="" />)}
                                        </div>
                                        <div class="panel-body">Property Name: {this.state.listing.propertyName}</div>
                                        <div class="panel-body">Address: {this.state.listing.address}</div>
                                        <div class="panel-body">Zipcode: {this.state.listing.zipcode}</div>
                                        <div class="panel-body">Flooring: {this.state.listing.flooring}</div>
                                        <div class="panel-body">Bedrooms: {this.state.listing.bedroom}</div>
                                        <div class="panel-body">Bathrooms: {this.state.listing.bathroom}</div>
                                        <div class="panel-body">Parking: {this.state.listing.parking}</div>
                                        <div class="panel-body">Lot Size: {this.state.listing.lotsize}</div>
                                        <div class="panel-body">Area: {this.state.listing.area}</div>
                                        <div class="panel-body">Rent Price per month: {this.state.listing.price}</div>
                                        <div class="panel-body">Home Type: {this.state.listing.homeType}</div>
                                        <div class="panel-body">Amenities: {this.state.listing.amenities}</div>
                                        <div class="panel-body">Availability Date: {this.state.listing.availabilityDate}</div>
                                        <div class="panel-body">Lease Term: {this.state.listing.leaseTerm}</div>
                                        <div class="panel-body">Year Built: {this.state.listing.yearBuilt}</div>
                                        <div class="panel-body">Additional: {this.state.listing.additional}</div>
                                        
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
                        isOpen={this.state.showListingEditModal}
                        onRequestClose={this.closeModal}
                        contentLabel="Rent Listing Modal" >
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
                                            <input type="number" size="50"  className="form-control" name="lotsize"  aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.lotsize} title="Enter lot size in sqft" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Area</b></span>
                                            </div>
                                            <input type="number" size="50"  className="form-control" name="area"  aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.area} title="Enter area in sqft. Number only" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Year Built</b></span>
                                            </div>
                                            <input type="number" size="50"  className="form-control" name="yearBuilt"  aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.yearBuilt} title="Enter year built. Number only" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Rent Price per month</b></span>
                                            </div>
                                            <input type="number" size="50"  className="form-control" name="price"  aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.price} title="Enter rent price in USD per month. Number only" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Home Type</b></span>
                                            </div>
                                            <select value={this.state.homeType} onChange={this.homeTypeChange} className="form-control" aria-label="category" aria-describedby="basic-addon1" required >
                                                <option value="Attached Single Family">Attached Single Family</option>
                                                <option value="Detached Single Family">Detached Single Family</option>
                                                <option value="Townhome">Townhome</option>
                                                <option value="Apartment">Apartment</option>
                                                
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
                                        {/* <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Flooring</b></span>
                                            </div>
                                            <input type="text" name="flooring" size="50"  className="form-control" aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.flooring} title="Mention flooring type" required />
                                        </div> */}
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Flooring Type</b></span>
                                            </div>
                                            <select value={this.state.flooring} onChange={this.flooringTypeChange} defaultValue={this.state.listing.flooring} className="form-control" aria-label="category" aria-describedby="basic-addon1" required >
                                                <option value="Wooden">Wooden</option>
                                                <option value="Carpet">Carpet</option>
                                                {/* <option value="both">Both</option> */}
                                            </select>
                                        </div>

                                        {/* <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Parking</b></span>
                                            </div>
                                            <input type="text" name="parking" size="50"  className="form-control" aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.parking} title="Parking Type" required />
                                        </div> */}

                                         <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Parking</b></span>
                                            </div>
                                            <select value={this.state.parking} onChange={this.parkingTypeChange} defaultValue={this.state.listing.parking}  className="form-control" aria-label="category" aria-describedby="basic-addon1" required >
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
                                                <span className="input-group-text" id="basic-addon1"><b>Lease Terms</b></span>
                                            </div>
                                            <input type="text" name="leaseTerm" size="50" className="form-control"  aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.leaseTerm} title="Mention Lease terms" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Availability Date</b></span>
                                            </div>
                                            <input type="date" size="50" name="availabilityDate" className="form-control"  aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.availabilityDate} title="Date from which property is available" required />
                                        </div>
                                        <div className="input-group mb-2">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1"><b>Additional Information</b></span>
                                            </div>
                                            <input type="text" size="50" className="form-control" name="additional" aria-describedby="basic-addon1" onChange={this.inputHandler} defaultValue={this.state.listing.additional} title="Add additional information if required"/>
                                        </div>


                                        <center>
                                            <Button variant="dark" type="submit">
                                                <b>Update Rent Listing</b>
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
                            isOpen={this.state.imageModal}
                            onRequestClose={this.closeModal}
                             contentLabel="Example Modal" >
                           
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


                        <Modal
                        isOpen={this.state.showApplicationModal}
                        onRequestClose={this.closeModal}
                        contentLabel="Rent Application Details Modal" >
                        <div>
                        <div class="panel panel-default">
                                        <div class="panel-heading">Application Details</div>
                                        <div class="panel-body">
                                        <div class="panel-body">Property Name: {this.state.listing.propertyName}</div>
                                        <div class="panel-body">Address: {this.state.listing.address}</div>

                                        {this.state.applications.map(application =>
                                            <div key={application._id}>
                                         <div class="panel panel-default">
    <div class="panel-heading">Name: {application.user.name}{" Email Id:   "}{application.user.emailId}</div>
                                        <div class="panel-body">
                                       
                                        <div class="panel-body">Applicant Address: {application.address}</div>
                                        <div class="panel-body">Applicant Credit score: {application.creditScore}</div>
                                        <div class="panel-body">Applicant SSN: {application.ssn}</div>
                                        <div class="panel-body">Employer: {application.employer}</div>
                                        <div class="panel-body">EmploymentId: {application.employmentId}</div>
                                        <div class="panel-body">Phone number: {application.phoneNumber}</div>
                                        <div class="panel-body">Security Deposit: {application.securityDeposit}</div>
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
                                <Button variant="danger" onClick={this.closeUpdateModal}>
                                    <b>Close</b>
                                </Button>
                            </center>
                            </form>
                        </Modal>

                        <Modal
                            isOpen={this.state.showVisitModal}
                            onRequestClose={this.closeModal}
                             contentLabel="Approval status Modal" >
                            
                         <form onSubmit={this.onUpdateStatus}>
                         <table className="table table-hover">
            <thead>
                <tr>
                    <th>Visitor Name</th>
                    <th>Visitor Email</th>
                    <th>Scheduled Date and Time </th>
                    
                </tr>
            </thead>
            <tbody>
            {this.state.visits.map(visit =>
                <tr>
                <td>{visit.user.name} </td>
            <td>{visit.user.emailId}</td>
            <td>{visit.schedule}</td>
                </tr>
            )}
             </tbody>
        </table>
                            <center>
                           
                                <Button variant="danger" onClick={this.closeModal}>
                                    <b>Close</b>
                                </Button>
                            </center>
                            </form>
                        </Modal>
                    </div>
        )
    }
}
export default AddRentListing;