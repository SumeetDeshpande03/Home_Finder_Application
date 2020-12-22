import React from 'react';
import { Button , Col, Container, Form, Card , Modal, Badge} from 'react-bootstrap';
import axios from 'axios';
import {Redirect} from 'react-router';

class FavoriteRentListingCard extends React.Component {

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

    onViewListingClick = e => {
      e.preventDefault();
      this.setState({ redirect: <Redirect to={{pathname: '/viewListing', state: {searchCard: this.props.searchCard, type:"rent", flow: 'Favorites'}}} /> });
    }

    render(){
        var isOpenhouse = null;
        if(this.props.searchCard.openhouseStartDate){
            var today = Date.parse(new Date().toDateString())
            var start = Date.parse(this.props.searchCard.openhouseStartDate)
            var end = Date.parse(this.props.searchCard.openhouseEndDate)
            console.log("Openhouse was scheduled for this listing")
            console.log("Start: ", start, "Today: ", today, "End:", end)
            if(start <= today && today <= end){
                isOpenhouse = (<Badge variant="success" style={{float: 'right'}}>Openhouse!!</Badge>)
            }
        }
        return(
          <div>
            {this.state.redirect}
                    <Card>
                        <Card.Header className="font-weight-bold">
                          {this.props.searchCard.propertyName}
                          {isOpenhouse}
                        </Card.Header>
                        <Card.Body style={{width: '100%'}}>
                          <Card.Text>
                            Zip Code: {this.props.searchCard.zipcode}
                            <br/>
                            Home Type: {this.props.searchCard.homeType}
                            <br/>
                            Flooring: {this.props.searchCard.flooring}
                            <br/>
                            Area: {this.props.searchCard.area}
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                          <Button variant="dark" style={{width: '100%', fontSize: 12}} onClick={this.onViewListingClick}>View Details</Button>
                        </Card.Footer>
                    </Card>
                    <br/>        
          </div>
        );
    }
}

export default FavoriteRentListingCard;