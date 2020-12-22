import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

class NavbarComponent extends Component {

    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    //handle logout to destroy the cookie
    handleLogout = () => {
        localStorage.clear();
    }

    render(){
        let navLogin = null;
        if(localStorage.getItem("token")&&localStorage.getItem("user_role")!='Admin'){
            console.log("Able to read cookie");
            navLogin = (

                <Navbar bg="dark" variant="dark">
                    <Nav.Link href="/"><h2 style={{color:'white'}}>Home Finder</h2></Nav.Link>
                    <Nav className="ml-auto">
                        <h4 style={{color:'white'}}>
                            <NavDropdown title={localStorage.getItem("user_name")}>
                                <NavDropdown.Item href="/addRentListing">My Rent Listing</NavDropdown.Item>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item href="/addSellListing">My Sell Listing</NavDropdown.Item>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item href="/favoriteListings">My Favorite Listings</NavDropdown.Item>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item href="/favoriteSearches">My Favorite Searches</NavDropdown.Item>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item href="/" onClick= {this.handleLogout}><h5><b>Logout</b></h5></NavDropdown.Item>
                            </NavDropdown>
                        </h4>
                        <Nav.Link href="/search"><h4 style={{color:'white'}}>Search</h4></Nav.Link>
                    </Nav>
                </Navbar>

                // <ul className="nav navbar-nav navbar-right">
                //     <li className="nav nav-item dropdown">
                //         <Link className="nav nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                //             Profile
                //         </Link>
                //         <div class="nav nav-item dropdown-menu" aria-labelledby="navbarDropdown">
                //             <Link to="/addRentListing" className="nav nav-link dropdown-item">My Rent Listing</Link>
                //             <Link to="/addSellListing" className="nav nav-link dropdown-item">My Sell Listing</Link>
                //         </div>
                //     </li>
                //     <li><Link to="/" onClick = {this.handleLogout}><span className="glyphicon glyphicon-user"></span>Logout</Link></li>
                // </ul>

            );
        }
        else if(localStorage.getItem("token")&&localStorage.getItem("user_role")=='Admin') {
            navLogin = (

                <Navbar bg="dark" variant="dark">
                    <Nav.Link href="/"><h2 style={{color:'white'}}>Home Finder</h2></Nav.Link>
                    <Nav className="ml-auto">
                        <h4 style={{color:'white'}}>
                            <NavDropdown title={localStorage.getItem("user_name")}>
                                <NavDropdown.Item href="/admin">Users List</NavDropdown.Item>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item href="/allRealtors">Realtors List</NavDropdown.Item>
                                <NavDropdown.Divider/>
                                <NavDropdown.Item href="/" onClick= {this.handleLogout}><h5><b>Logout</b></h5></NavDropdown.Item>
                            </NavDropdown>
                        </h4>
                        <Nav.Link href="/search"><h4 style={{color:'white'}}>Search</h4></Nav.Link>
                    </Nav>
                </Navbar>

                // <ul className="nav navbar-nav navbar-right">
                // <li><Link to="/" onClick = {this.handleLogout}><span className="glyphicon glyphicon-user"></span>Logout</Link></li>
                // </ul>
            );
        } else {
            //Else display login button
            console.log("Not Able to read token");
            navLogin = (
                
                <Navbar bg="dark" variant="dark">
                    <Nav.Link href="/"><h2 style={{color:'white'}}>Home Finder</h2></Nav.Link>
                    <Nav className="ml-auto">
                        <Nav.Link href="/search"><h4 style={{color:'white'}}>Search</h4></Nav.Link>
                        <Nav.Link href="/signup"><h4 style={{color:'white'}}>Register</h4></Nav.Link>
                        <Nav.Link href="/login"><h4 style={{color:'white'}}>Login</h4></Nav.Link>
                    </Nav>
                </Navbar>

                // <ul className="nav navbar-nav navbar-right">
                //         <li><Link to="/signup">Sign Up</Link></li>
                //         <li><Link to="/login"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
                // </ul>
            )
        }

        return (
            <div> 
                {navLogin}
            </div> 
        );
    }

}

export default NavbarComponent;