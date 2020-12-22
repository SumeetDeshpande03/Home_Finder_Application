import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Login/Signup';
// import Home from './Home/Home';
import AdminLandingPage from './Admin/AdminLandingPage'
import RealtorList from './Admin/RealtorList'
import BuyPage from './Buy/Buy'
import AddRentListing from './User/addRentListingPage'
import AddSellListing from './User/addSellListingPage'
import SubmitRentApplication from './User/submitRentApplication'
import SearchListings from './Search/SearchListings'
import ViewListing from './Search/ViewListing';
import LandingPage from './LandingPage/LandingPage';
import FavoriteListings from './Favorites/FavoriteListings';
import FavoriteSearches from './FavoriteSearches/FavoriteSearches';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={LandingPage}/>
                <Route path="/login" component={Login}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/admin" component={AdminLandingPage}/>
                <Route path="/allRealtors" component={RealtorList}/>
                <Route path="/buy" component={BuyPage}/>
                <Route path="/addRentListing" component={AddRentListing}/>
                <Route path="/addSellListing" component={AddSellListing}/>
                <Route path="/submitRentApplication" component={SubmitRentApplication}/>
                <Route path="/search" component={SearchListings}/>
                <Route path="/viewListing" component={ViewListing}/>
                <Route path="/favoriteListings" component={FavoriteListings}/>
                <Route path="/favoriteSearches" component={FavoriteSearches}/>
            </div>
        )
    }
}
//Export The Main Component
export default Main;