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

//Define a Realtor List Component with All realtors list in the system
class RealtorList extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
           allRealtors:[],
           approvalStatus:'Pending'
           
        }
        //Bind the handlers to this class
       this.getRealtorList=this.getRealtorList.bind(this);
       this.closeModal = this.closeModal.bind(this);

    }
    componentDidMount=()=>
    {
        this.getRealtorList()
    }
      getRealtorList = () =>
      {
        axios.get(backendURI+'/admin/getAllRealtors')
        .then(response=>{
            if(response.status==200)
            {
                let allRealtors=response.data;
                console.log(allRealtors);
                this.setState({
                    allRealtors
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
      openStatus(realtor) {
        this.setState({
            openStatus: true ,
            realtorEmailId:realtor.emailId      
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
        const data={realtorEmailId :this.state.realtorEmailId,
                    approvalStatus:this.state.approvalStatus      
        };
        axios.post(backendURI +'/admin/realtorApprovalStatusUpdate',data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
               
                this.setState({
                    openStatus:false 
                });
                message.success('Approval Status Updated');
            }
        this.getRealtorList();
        })
        .catch(err => { 
            this.setState({errorMessage:"Approval status not updated"});
        });
    }
    
    render(){
        //redirect based on successful login for Admin :Pending dependency on login
        let redirectVar = null;let navAdmin=null;let realtorlist;

        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />; 
        }
        else if(localStorage.getItem("user_role")=='Admin') {
            redirectVar = <Redirect to="/allRealtors" />; 
        }
        else{
            redirectVar = <Redirect to="/search" />;
        }

        realtorlist =( <div className="panel panel-default p50 uth-panel">
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Realtor Name</th>
                    <th>Realtor Email</th>
                    <th>Approval Status</th>
                </tr>
            </thead>
            <tbody>
            {this.state.allRealtors.map(realtor =>
           <tr key={realtor._id}>
            <td>{realtor.name}</td>
            <td>{realtor.emailId}</td>
            <td>{realtor.approvalStatus}</td>
            <td><Button variant="dark" onClick={() => this.openStatus(realtor)}>Change Status</Button></td>
           </tr>
            )
          }
             </tbody>
        </table>
</div>)

        navAdmin = (
            <Button variant="dark"><Link to="/admin" style={{color:'white'}}>Users List</Link> </Button>
        )
        return(
         <div>
             {redirectVar}
             <NavbarComponent/>
            <h3>Welcome Admin: To view users list click here :{navAdmin}</h3>
           
                    
              
            <h4>Realtors:</h4>
            {realtorlist}  

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
export default RealtorList;