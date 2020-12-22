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
import NavbarComponent from '../LandingPage/NavbarComponent'

//Define a Admin Landing Page Component with All user list in the system
class AdminLandingPage extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
           allUsers:[],
           approvalStatus:'Pending'
           
        }
        //Bind the handlers to this class
       this.getUserList=this.getUserList.bind(this);
       this.closeModal = this.closeModal.bind(this);

    }
    componentDidMount=()=>
    {
        this.getUserList()
    }

    // Function to get all Users in system with their approval status
      getUserList = () =>
      {
        axios.get(backendURI+'/admin/getAllUsers')
        .then(response=>{
            if(response.status==200)
            {
                let allUsers=response.data;
                console.log(allUsers);
                this.setState({
                    allUsers
                })
            }
        })
        .catch(err=>{
            this.setState({errorMessage:"There was error encountered"})
        })
      } 

      // This will close modal for approval status change 
      closeModal() {
        this.setState({
            openStatus:false
        });
    }

    //This will open Modal for approval status change
      openStatus(user) {
        this.setState({
            openStatus: true ,
            userEmailId:user.emailId
                 
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
        const data={userEmailId :this.state.userEmailId,
                    approvalStatus:this.state.approvalStatus      
        };
        axios.post(backendURI +'/admin/userApprovalStatusUpdate',data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
               
                this.setState({
                    openStatus:false 
                });
                message.success('Approval Status Updated');
            }
        this.getUserList();
        })
        .catch(err => { 
            this.setState({errorMessage:"Approval status not updated"});
        });
    }
    
    render(){
        //redirect based on successful login for Admin
        let redirectVar = null;let navAdmin=null;let userlist;
       
        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />; 
        }
        else if(localStorage.getItem("user_role")=='Admin') {
            redirectVar = <Redirect to="/admin" />; 
        }
        else{
            redirectVar = <Redirect to="/search" />;
        }
        userlist =( <div className="panel panel-default p50 uth-panel">
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>Approval Status</th>
                </tr>
            </thead>
            <tbody>
            {this.state.allUsers.map(user =>
           <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.emailId}</td>
            <td>{user.approvalStatus}</td>
            <td><Button variant="dark" onClick={() => this.openStatus(user)}>Change Status</Button></td>
           </tr>
            )
          }
             </tbody>
            
        </table>   
</div>)

        // navAdmin = (
        //     <ul className="nav navbar-nav navbar-right">
        //             <li><Link to="/allRealtors">Realtors List</Link></li>
        //     </ul>
        // )

        navAdmin=(<Button variant="dark"><Link to="/allRealtors" style={{color:'white'}}>Realtors List</Link> </Button>)
        return(
         <div>
             {redirectVar}
             <NavbarComponent/>
            <h3>Find all users list below. To view realtors list click here : {navAdmin} </h3>
            <p>{ ' '}</p>           
            {/* <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                <div className="navbar-header">    
                    </div>
                    {navAdmin}
                </div>
            </nav> */}
            <h4>Users:</h4>
            {userlist}  

            <Modal
                            isOpen={this.state.openStatus}
                            onRequestClose={this.closeModal}
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
export default AdminLandingPage;