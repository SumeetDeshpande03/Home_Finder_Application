import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import {backendURI} from '../../common/config.js';
import { Button , Col, Container, Form, Card , CardColumns, CardGroup, Modal, CardDeck, Row, Dropdown} from 'react-bootstrap';
import FavoriteSellListingCard from './FavoriteSellListingCard';
import FavoriteRentListingCard from './FavoriteRentListingCard';
import NavbarComponent from '../LandingPage/NavbarComponent'

class FavoriteListings extends React.Component {
    constructor() {
        super();
        this.state = {
            favoriteSellListings: [],
            favoriteRentListings: []
        }
    }

    componentDidMount(){
        axios.get(backendURI+'/saveAsFavorites/getUserDetails?id='+localStorage.getItem("user_id"))
        .then(response => {
            if (response.status === 200) {
                this.setState({
                    favoriteSellListings : response.data.favoriteSellListings,
                    favoriteRentListings : response.data.favoriteRentListings
                })
            }
        })
    }

    onChangeHandler = e => {
            this.setState({
                [e.target.id] : e.target.value
            });
        };

    render() {

        let redirectVar = null;

        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />; 
        } else if(localStorage.getItem("user_role")==='Admin') {
            redirectVar = <Redirect to="/admin" />; 
        } else{
            redirectVar =this.state.redirect;
        }

        return (
          <div style={{fontSize: 13}}>
            {redirectVar}
            <NavbarComponent/>
            <Container>
                {/* {this.state.redirect} */}
                {/* <Button variant="dark" >Add Address</Button> */}
                <br/>
                <h1>My Favorite Sell Listings: </h1>
                <br/>
                <CardColumns>
                  {this.state.favoriteSellListings.map((searchCard)=>{
                    return <FavoriteSellListingCard key={searchCard._id} searchCard={searchCard} type={this.state.searchType}/>
                  })}
                </CardColumns>
                <br/>
                <hr/>
                <br/>
                <h1>My Favorite Rent Listings: </h1>
                <CardColumns>
                  {this.state.favoriteRentListings.map((searchCard)=>{
                    return <FavoriteRentListingCard key={searchCard._id} searchCard={searchCard} type={this.state.searchType}/>
                  })}
                </CardColumns>
                <br/>
                <br/>
            </Container>    
                        
          </div>
        );


      }
};

export default FavoriteListings;