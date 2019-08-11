import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Jumbotron, Container, Row, Col, Card, Modal, ModalHeader, ModalBody,ModalFooter, CardBody, CardTitle, CardSubtitle, CardText, Button} from 'reactstrap';
import API from "../utils/API";
import MapGL, { Marker, Popup, NavigationControl } from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Iframe from 'react-iframe';
// import ReactMapGL, {Marker, Popup, NavigationControl} from 'react-map-gl';
const TOKEN =  process.envTOKEN ||

class Details extends Component {
  state = {
    allInfo: [],
    name: localStorage.getItem('name'),
    lat: localStorage.getItem('lat'),
    long: localStorage.getItem('long'),
    address: localStorage.getItem('address'),
    yelpInfo: [],
    modal: false,
    yelpReviews: []
    
    
  };

  storeName = (name) =>{
    // var s = '/Controller/Action?id=11112&value=4444';
    
      if(name.includes("COTA ")){
          return "Circuit of the Americas"
      }else if(name.includes("HEB ")){
          return "HEB Store"
      }else if(name.includes("#")){
        return name.substring(0, name.indexOf('#'));
      }
      else{
          return name;
      }
    
  }

  componentDidMount = () => {
    
    API.getPlace(localStorage.getItem('idNumb'))
      .then(res =>
        {   console.log(res.data)
            this.setState({allInfo: res.data,
        name: res.data[0].restaurant_name});
        })
        .catch(err => console.log(err));
            API.getYelp(this.state.lat, this.state.long, this.storeName(this.state.name))
        .then(res => {
            console.log("In componentdidMount: "+ JSON.stringify(res.data.businesses[1]));
            if(res.data.businesses[0] !== undefined){
                this.setState({yelpInfo: res.data.businesses[0]});
                API.getYelpReviews(this.state.yelpInfo.id)
            .then(rez => {
            console.log(rez.data.reviews)
            this.setState({yelpReviews: rez.data.reviews});
          
          
        })  
            }
            
        });
        // }else {
        //     API.getYelp(this.state.lat, this.state.long, this.state.name)
        // .then(res => {
        //     console.log(res.data.businesses[0]);
        //     this.setState({yelpInfo: res.data.businesses[0]});  
        //     API.getYelpReviews(this.state.yelpInfo.id)
        //     .then(rez => {
        //     console.log(rez.data.reviews)
        //     this.setState({yelpReviews: rez.data.reviews});
          
          
        // })
        // });
        // }
    
    
  }

  

  calcAvgScore = () => {
      var score = 0;
      var number = 0;
      for(var x in this.state.allInfo){
        score += parseInt(this.state.allInfo[x].score)
        number = parseInt(x)+1;

      }
      return score/number;
  }


  numberofStars = (number) => {
    if(number >= 5){
        return <div><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img></div>
    }else if(number >=4 && number <4.5 ){
        return <div><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img></div>
    }else if (number >=3 && number <3.5) {
        return <div><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img></div>
    }else if (number >=2 && number < 2.5){
        return <div><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img></div>
    }else if (number >=1 && number < 1.5){
        return <div><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img></div>
    }else if(number >= 4.5){
        return <div><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/star-half.png"></img></div>
    }else if (number <4 && number >=3.5){
        return <div><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/star-half.png"></img></div>
    }else if (number <3.5 && number >= 2){
        return <div><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/star-half.png"></img></div>
    }else if (number <2.5 && number >= 1){
        return <div><img src="https://img.icons8.com/ios-filled/50/000000/christmas-star.png"></img><img src="https://img.icons8.com/ios-filled/50/000000/star-half.png"></img>{this.state.yelpInfo.review_count}Reviews</div>
    }else {
        return <div></div>
    }
  }

  toggle = () => {
      if(this.state.modal === false){
          this.setState({modal:true})
      }else if(this.state.modal === true){
          this.setState({modal:false})
      }
  }

 
 
  isClosed = (status) => {
      if(status === true){
        return <img style={{height:"100px"}}src="https://www.pngarts.com/files/4/Sorry-We-Are-Closed-PNG-Image-Background.png" className="float-right"/>
    } else {
          return <img style={{height:"90px"}}src="http://www.caresouth-carolina.com/wp-content/uploads/2018/10/weareopen.png" className="float-right"/>
      }
  }

  priceInfo = (price) => {
    
      if(price === "$"){
          return "($)"
      }else if(price === "$$"){
        return "($$)"
    }else if(price === "$$$"){
        return "($$$)"
    }else if(price === "$$$$"){
        return "($$$$)"
    }else if(price === "$$$$$"){
        return "($$$$$)"
    }else if(price === "$$$$$$"){
        return "($$$$$$)"
    }else if(price === undefined){
        return ""
    }
    
    
  }

  checkprice = (price) => {

  }

  disableButtons = (call, yelp) => {
      console.log(yelp);
      console.log(call);
      if(call === undefined && yelp===undefined){
        return <div></div>
      }else if (call === undefined && yelp!==undefined){
        return <div> <Button className="float-right" size="lg" href={this.state.yelpInfo.url} color="warning" target="_blank">Yelp Site</Button></div>
      }else if (call !== undefined && yelp===undefined){
        return <div><Button size="lg" href={"tel:"+this.state.yelpInfo.display_phone} color="success">Call</Button> </div>
      }else{
        return <div><Button size="lg" href={"tel:"+this.state.yelpInfo.display_phone} color="success">Call</Button> <Button className="float-right" size="lg" href={this.state.yelpInfo.url} color="warning" target="_blank">Yelp Site</Button></div>
      }
      
  }

  


  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>
                {this.storeName(this.state.name)}{" "} {this.priceInfo(this.state.yelpInfo.price)}
              </h1>
              {this.isClosed(this.state.yelpInfo.is_closed)}
              <h2>{this.numberofStars(this.state.yelpInfo.rating)}</h2>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
            <Col>
           
      <Card style={{ width: '100%', height: '100%' }}>
      <MapGL
               style={{ width: '100%', height: '400px' }}
               latitude={parseFloat(localStorage.getItem('lat'))}
               longitude={parseFloat(localStorage.getItem('long'))}
               zoom={12}
               mapStyle='mapbox://styles/mapbox/light-v9'
               accessToken={TOKEN}
             >
            <Marker latitude={parseFloat(localStorage.getItem('lat'))} longitude={parseFloat(localStorage.getItem('long'))} offsetLeft={-20} offsetTop={-10}>
             <div><span role="img">📍</span></div>
           </Marker>  
            <NavigationControl showCompass showZoom position='top-right' />
            </MapGL>        
            <CardBody>
          <CardTitle style={{textAlign: "center"}}>📍<h2 >{this.state.address}</h2></CardTitle>
          <Card style={{ width: '80%', margin: "auto", padding: "10px", textAlign: "center" }}>
              <CardBody><h2>Average Health Score:</h2><h3> {this.calcAvgScore()} out of 100</h3> 
              
              <br></br>
              Data provided by <br></br><a href="https://data.austintexas.gov"><img style={{ width: '50%'}} src="https://pbs.twimg.com/profile_images/481878662145261569/wb28aHGD.jpeg"></img></a> </CardBody>
        
          </Card>
            <br></br>
         {this.disableButtons(this.state.yelpInfo.display_phone, this.state.yelpInfo.url)}
          <br></br>
       
          <Form action="http://maps.google.com/maps" method="get" target="_blank">
            <br></br>
            <Label for="saddr"><h4>Enter your location</h4></Label>
            <Input type ="text" name="saddr" />
            <Input type="hidden" name="daddr" value={this.state.address + " Austin, TX" }/>
            <br></br>
            <div style={{textAlign: "center"}}><Button size="lg" type="submit" color="info">Get Directions</Button></div>
            </Form>

        </CardBody>
      </Card >

              
            </Col>
            {this.state.yelpInfo ? (
            <Col>
            <Card style={{ width: '100%', height: '100%' }}>
                
            <CardBody>
          <CardTitle><img src={this.state.yelpInfo.image_url} style={{ width: '100%'}} /></CardTitle>
          <CardSubtitle><h2>Recent Reviews</h2></CardSubtitle>
          {this.state.yelpReviews.map((review, index) => (
            <CardText key={index}><h5>{review.text} {' '} {this.numberofStars(review.rating)}</h5></CardText>
            
          ))}
          
        {/* <Button color="danger" onClick={this.toggle}>Get Directions</Button> {" "}
        <Modal isOpen={this.state.modal} toggle={this.toggle} className="modal-dialog modal-lg"> 
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody style={{height: '600px'}}>
          <Iframe url={"https://www.yelp.com/map/"+this.state.yelpInfo.alias}
        width="100%"
        height="100%"
        id="myId"
        display="initial"
        position="relative"/>          
        </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal> */}

        </CardBody>
      </Card>

            </Col>) : ""}
          
        </Row>
      </Container>
    );
  }
}

export default Details;