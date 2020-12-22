import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {backendURI} from '../../common/config.js';
import { Button , Col, Container, Form, Card , CardColumns, CardGroup, Modal, CardDeck, Row, Dropdown} from 'react-bootstrap';
import SearchCard from './SearchCard';
import NavbarComponent from '../LandingPage/NavbarComponent'
import {message } from 'antd';

class SearchListings extends React.Component {
    constructor() {
        super();
        this.state = {
            searchType: "buy",
            bathroom: "",
            homeType: "",
            flooring: "",
            zipcode: "",
            price: "",
            area: "",
            bedroom: "",
            parking: "",
            amenities: "",
            searchCards: [],
            show: false
        }
        //this.handleShow = this.handleShow.bind(this)
    }

    componentDidMount(){
      var queryData = null;
      if(this.props.location.state) {
        this.setState(this.props.location.state.favoriteSearchCard)
        queryData = this.props.location.state.favoriteSearchCard
      } else {
        queryData = this.state
      }
      queryData["user_id"] = localStorage.getItem("user_id")
      console.log(queryData)
      axios.post(backendURI + '/search', queryData).then(res => {
        console.log(res.data)
        if (res.status === 200) {
            this.setState({
              searchCards : res.data
            })
          }
      })
    }

    onChangeHandler = e => {
            this.setState({
                [e.target.id] : e.target.value //.toLowerCase()
            });
        };

    onSubmitHandler = e =>{

            e.preventDefault();

            const data = {
                bathroom: this.state.bathroom,
                homeType: this.state.homeType,
                flooring: this.state.flooring,
                zipcode: this.state.zipcode,
                price: this.state.price,
                area: this.state.area,
                bedroom: this.state.bedroom,
                parking: this.state.parking,
                amenities: this.state.amenities,
                searchType: this.state.searchType
            }
            //Always add UserID to the payload so that his own listings are not visible.
            data["user_id"] = localStorage.getItem('user_id')
            console.log(data);
            console.log(this.state.searchType)

            axios.post(backendURI+'/search',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    //console.log(response.data.length)
                    this.setState({
                        successFlag : true,
                        searchCards : response.data
                    })
                    //alert("Signed up successfully!!Login Now!");
                }
            })
            .catch(err => {
                this.setState({errorMessage: err.response.data});
            });
        }

    // Test Modal - Start
    handleClose = async(e) =>{
        this.setState({show: false}, ()=>{console.log(this.state)});
    };
    handleShow = async(e) =>{
        this.setState({show: true}, ()=>{console.log(this.state)});

    };
    saveFavSearch = e =>{
        //console.log(e)
        //console.log("You selected " + this.state.favSearchName)
        const data = {
            user_id: localStorage.getItem("user_id"),
            parameters: {
                searchType: this.state.searchType,
                bathroom: this.state.bathroom,
                homeType: this.state.homeType,
                flooring: this.state.flooring,
                zipcode: this.state.zipcode,
                price: this.state.price,
                area: this.state.area,
                bedroom: this.state.bedroom,
                parking: this.state.parking,
                amenities: this.state.amenities

            }
        }
        console.log(data)
        axios.post(backendURI + '/saveAsFavorites/addFavSearch', data).then(res => {
            console.log(res.data)
            if (res.status === 200) {
                console.log("saved to favorite searches")
                message.success("Successfully saved to favorite searches!")
            } else {
                console.log("error fetching data")
            }
        })
        this.handleClose()
    }
    //Test Modal - End

    render() {

        var favSearchButton = null
        if(localStorage.getItem("token") && localStorage.getItem("user_role")!='Admin'){
            favSearchButton = (<Button variant="success" style={{height: '50%', marginTop: '1.7%'}} onClick={this.saveFavSearch}>
                Fav Search
            </Button>)
        }
        return (
          <div style={{fontSize: 13}}>
            <NavbarComponent/>
            {/*Test Modal - Start
            <Button variant="primary" onClick={this.handleShow}>
                Launch demo modal
            </Button>

            <Modal show={this.state.show} onHide={this.handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" size="50" name="favSearchName" className="form-control" aria-label="propertyname" onChange={this.inputHandler} pattern=".*\S.*" placeholder="What would you like to call this search?" required />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={this.saveFavSearch}>
                        Save as Favorite Search
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*Test Modal - End*/}
            <Container>
                <Form onSubmit={this.onSubmitHandler} style={{fontSize: 10}}>
                    <Form.Row>
                          <Form.Group as={Col}>
                            <Form.Label>Price</Form.Label>
                            <Form.Control as="select"
                                id="price"
                                value={this.state.price}
                                onChange={this.onChangeHandler}
                                >
                                <option></option>
                                <option value="0-2000">$0 - $2000</option>
                                <option value="2000-4000">$2000 - $4000</option>
                                <option value="4000-10000">$4000 - $10000</option>
                                <option value="10000-1000000">$10000 +</option>
                            </Form.Control>
                          </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>#Bathrooms</Form.Label>
                            <Form.Control as="select" defaultValue="1"
                                id="bathroom"
                                value={this.state.bathroom}
                                onChange={this.onChangeHandler}
                                >
                                <option></option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>#Bedrooms</Form.Label>
                            <Form.Control as="select" defaultValue="1"
                                id="bedroom"
                                value={this.state.bedroom}
                                onChange={this.onChangeHandler}
                                >
                                <option></option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Area</Form.Label>
                            <Form.Control as="select"
                                id="area"
                                value={this.state.area}
                                onChange={this.onChangeHandler}
                                >
                                <option></option>
                                <option value="0-500">0-500 sq. ft.</option>
                                <option value="500-1000">500-1000 sq. ft.</option>
                                <option value="1000-1500">1000-1500 sq. ft.</option>
                                <option value="1500-2500">1500-2500 sq. ft.</option>
                                <option value="2500-25000">2500+ sq. ft.</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Flooring</Form.Label>
                            <Form.Control as="select" defaultValue="Wooden"
                                id="flooring"
                                value={this.state.flooring}
                                onChange={this.onChangeHandler}
                                >
                                //<option></option>
                                <option value="Wooden">Wooden</option>
                                <option value="Carpet">Carpet</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Parking</Form.Label>
                            <Form.Control as="select" defaultValue=""
                                id="parking"
                                value={this.state.parking}
                                onChange={this.onChangeHandler}
                                >
                                <option></option>
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>Zip Code</Form.Label>
                          <Form.Control
                            id="zipcode"
                            value={this.state.zipcode}
                            onChange={this.onChangeHandler}
                          />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Home Type</Form.Label>
                            <Form.Control as="select"
                                id="homeType"
                                value={this.state.homeType}
                                onChange={this.onChangeHandler}
                                >
                                <option></option>
                                <option value="Apartment">Apartment</option>
                                <option value="Townhome">Townhome</option>
                                <option value="Attached Single Family">Attached Single Family</option>
                                <option value="Detached Single Family">Detached Single Family</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Amenities</Form.Label>
                                <Form.Control as="select"
                                    id="amenities"
                                    value={this.state.amenities}
                                    onChange={this.onChangeHandler}
                                    >
                                    <option></option>
                                    <option value="Swimming Pool">Swimming Pool</option>
                                    <option value="Gymnasium">Gymnasium</option>
                                    <option value="Jacuzzi">Jacuzzi</option>
                                </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Listing Type</Form.Label>
                            <Form.Control as="select"
                                id="searchType"
                                value={this.state.searchType}
                                onChange={this.onChangeHandler}
                                >
                                <option value="buy">Buy</option>
                                <option value="rent">Rent</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="dark" style={{height: '50%', marginTop: '1.7%'}} onClick={this.onSubmitHandler}>
                            Search
                        </Button>
                        &nbsp;
                        {favSearchButton}
                    </Form.Row>
                </Form>
                {/* {this.state.redirect} */}
                {/* <Button variant="dark" >Add Address</Button> */}
                <br/>
                <CardColumns>
                  {this.state.searchCards.map((searchCard)=>{
                    return <SearchCard key={searchCard._id} searchCard={searchCard} type={this.state.searchType}/>
                  })}
                </CardColumns>
            </Container>    
                        
          </div>
        );


      }
};

export default SearchListings;