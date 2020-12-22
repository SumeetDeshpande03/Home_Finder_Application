import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import {backendURI} from '../../common/config.js';
import { Button , Col, Container, Form, Card , CardColumns, CardGroup, Modal, CardDeck, Row, Dropdown} from 'react-bootstrap';
import FavoriteSearchCard from './FavoriteSearchCard';
import NavbarComponent from '../LandingPage/NavbarComponent'

class FavoriteSearches extends React.Component {
    constructor() {
        super();
        this.state = {
            favoriteSearchCards: []
        }
    }

    componentDidMount(){
        axios.get(backendURI+'/saveAsFavorites/getUserDetails?id='+localStorage.getItem("user_id"))
        .then(response => {
            if (response.status === 200) {
                for(var card in response.data.favoriteSearchCards){
                    response.data.favoriteSearchCards[card]["name"] = "Search "+card
                }
                this.setState({
                    favoriteSearchCards : response.data.favoriteSearchCards
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
                <h1>My Favorite Searches: </h1>
                <br/>
                <CardColumns>
                  {this.state.favoriteSearchCards.map((favoriteSearchCard)=>{
                    return <FavoriteSearchCard key={favoriteSearchCard._id} favoriteSearchCard={favoriteSearchCard}/>
                  })}
                </CardColumns>
            </Container>                        
          </div>
        );
    }
};

export default FavoriteSearches;