import React, {Component} from 'react';
import First from '../../images/HomeFinder1.png'
import Second from '../../images/HomeFinder2.png'
import NavbarComponent from './NavbarComponent';


class LandingPage extends Component{
    //call the constructor method
    constructor(props){
        super(props);
    }
    
    render(){
        
        let redirectVar = null;
       
        return(
            <div>
                {redirectVar}
                <NavbarComponent/>
                <section>
                    <img src={First} style={{width:'100%'}}></img> 
                    <img src={Second} style={{width:'100%'}}></img> 
                </section>
            {/* <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand brand-name">
                     
                    </a>     
                    </div>
                    <ul className="nav navbar-nav">
                        <li><Link to="/search">Home</Link></li>
                        
                    </ul>
                    
                    {navLogin}
               
                    <h2 style={{ display: "flex", color: "white", justifyContent: "center", alignItems: "center" , marginTop: "10px"}}>Home Finder</h2>
                </div>
            </nav> */}
        </div>
        )
    }
}
export default LandingPage;