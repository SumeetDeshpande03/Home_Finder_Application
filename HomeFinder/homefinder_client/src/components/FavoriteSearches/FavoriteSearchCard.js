import React from 'react';
import { Button , Col, Container, Form, Card , Modal, Badge} from 'react-bootstrap';
import axios from 'axios';
import {Redirect} from 'react-router';

class FavoriteSearchCard extends React.Component {

    constructor(){
        super();
        this.state = {
          redirect:''
        }
    }

    onChangeHandler = e => {
        this.setState({
            [e.target.id] : e.target.value
        });
    };

    onViewFavoriteSearchClick = e => {
      e.preventDefault();
      this.setState({ redirect: <Redirect to={{pathname: '/search', state: {favoriteSearchCard: this.props.favoriteSearchCard}}} /> });
    }

    render(){
        //Workaround to display searchType as "Buy" instead of "buy"
        var searchType = this.props.favoriteSearchCard.searchType
        searchType = searchType.charAt(0).toUpperCase()+searchType.slice(1)
        return(
          <div>
              {this.state.redirect}
                    <Card> 
                        <Card.Header className="font-weight-bold">
                          {this.props.favoriteSearchCard.name}
                        </Card.Header>
                        
                        <Card.Body style={{width: '100%'}}>
                          <Card.Text>
                            Search Type: {searchType === "" ? "-" : <b>{searchType}</b>}
                            <br/>
                            Bathrooms: {this.props.favoriteSearchCard.bathroom === "" ? "-" : <b>{this.props.favoriteSearchCard.bathroom}</b>}
                            <br/>
                            Home Type: {this.props.favoriteSearchCard.homeType === "" ? "-" : <b>{this.props.favoriteSearchCard.homeType}</b>}
                            <br/>
                            Flooring: {this.props.favoriteSearchCard.flooring === "" ? "-" : <b>{this.props.favoriteSearchCard.flooring}</b>}
                            <br/>
                            Zip Code: {this.props.favoriteSearchCard.zipcode === "" ? "-" : <b>{this.props.favoriteSearchCard.zipcode}</b>}
                            <br/>
                            Price: {this.props.favoriteSearchCard.price === "" ? "-" : <b>{this.props.favoriteSearchCard.price}</b>}
                            <br/>
                            Area: {this.props.favoriteSearchCard.area === "" ? "-" : <b>{this.props.favoriteSearchCard.area}</b>}
                            <br/>
                            Bedroom: {this.props.favoriteSearchCard.bedroom === "" ? "-" : <b>{this.props.favoriteSearchCard.bedroom}</b>}
                            <br/>
                            Parking: {this.props.favoriteSearchCard.parking === "" ? "-" : <b>{this.props.favoriteSearchCard.parking}</b>}
                            <br/>
                            Amenities: {this.props.favoriteSearchCard.amenities === "" ? "-" : <b>{this.props.favoriteSearchCard.amenities}</b>}
                            <br/>
                          </Card.Text>
                        </Card.Body>

                        <Card.Footer>
                          <Button variant="dark" style={{width: '100%', fontSize: 12}} onClick={this.onViewFavoriteSearchClick}>View Search</Button>
                        </Card.Footer>
                    </Card>
                    <br/>        
          </div>
        );
    }
}

export default FavoriteSearchCard;