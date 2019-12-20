import React from 'react';
import $ from 'jquery';
import './App.css';

// Header Code Start
const Title=()=>{
  return(
    <div id="TitleDiv">
      iAlbum
    </div>
  )
}

const Form=({onPasswordChange, onUserNameChange})=>{
  return(
    <div id="FormDiv">
      Username:<input type='text' margin='2px' className="LogInputDiv" onChange={onUserNameChange}/>
      Password:<input type='password' margin='2px' className="LogInputDiv" onChange={onPasswordChange}/>
    </div>
  )
}
const LogInAndOut=({user, loggedIn, onPasswordChange, onUserNameChange, onSubmitLog})=>{
  var status='log in'
  if(loggedIn){
    status='log out';
  }else{
    status='log in';
  }
  return(
    <div id='LogInAndOutDiv'>
      {
        loggedIn
        ?<div id="Username">Hello {user}!</div>
        :<Form onPasswordChange={onPasswordChange} onUserNameChange={onUserNameChange}/>
      }
      <button id='LogButtonDiv' onClick={onSubmitLog}>{status}</button>
    </div>
  )
}

const Header=({loggedIn, user, onPasswordChange, onUserNameChange, onSubmitLog})=>{
  return(
    <div id="HeaderDiv">
      <Title/>
      <LogInAndOut loggedIn={loggedIn} user={user} onPasswordChange={onPasswordChange} onUserNameChange={onUserNameChange} onSubmitLog={onSubmitLog}/>
    </div>
  )
}
//Header Code End


//Body Code Start
const Friend=({FriendName, getPhotos, id})=>{
  return(
    <div className="FriendDiv" onClick={getPhotos} id={id}>
      {FriendName}'s Album
    </div>
  )
}
const FriendBox=({friends, getPhotos})=>{
  var friendNames=friends.map((friend)=>{
    return friend["username"];
  })
  var friendIDs=friends.map((friend)=>{
    return friend["_id"];
  })
  return(
    <div id="FriendBoxDiv">
      {

      }
      <div className="FriendDiv" onClick={getPhotos} id="0">
        My Album
      </div>
      {
        friendNames.map((friend, i)=>{
          return(
            <Friend FriendName={friend} key={i} getPhotos={getPhotos} id={friendIDs[i]}/>
          )
        })
      }
    </div>
  )
}
const SideBar=({friends, getPhotos,loggedIn})=>{
  return(
    <div id="SideBarDiv">
      {
        loggedIn
        ?<FriendBox friends={friends} getPhotos={getPhotos}/>
        :<div></div>
      }
    </div>
    )
}

const DeleteButton=({photoID, deletePhoto})=>{
  return(
    <button className="DeleteButtonDiv" id={photoID} onClick={deletePhoto}>Delete</button>
  )
}
const LikeButton=({photoID, likePhoto})=>{
  return(
    <button className="LikeButtonDiv" id={photoID} onClick={likePhoto}>Like</button>
  )
}
const UploadButton=({uploadPhoto})=>{
  return(
    <button className="UploadButtonDiv" onClick={uploadPhoto}>Upload</button>
  )
}
const ChooseFileButton=()=>{
  return(
    <input type='file' accept="image/jpg, image/jpeg" id="filepicker"/>
  )
}

const PhotoCard=({url, likes, photoID, showPhoto, myAlbum, deletePhoto, likePhoto})=>{
  var likeStatement="";
  if(likes.length>0){
    for (var i=0; i<likes.length; i++){
      if(i<likes.length-1){
        likeStatement+=likes[i]+", ";
      }else{
        likeStatement+=likes[i]+" ";
      }
    }
    likeStatement+="liked this photo";
  }
  return(
    <div id="PhotoCardDiv">
      <div id="PhotoDiv">
        <img src={url} alt='' className="ImgDiv" onClick={showPhoto} id={url+";"+likeStatement+";"+photoID}/>
      </div>
      <div className="PhotoInfoDiv">
        <div className="LikeStatementDiv">
          {likeStatement}
        </div>
        {
          myAlbum
          ?<DeleteButton photoID={photoID} deletePhoto={deletePhoto}/>
          :<LikeButton photoID={photoID} likePhoto={likePhoto}/>
        }
      </div>
    </div>
  )
}
const PhotoList=({photos, showPhoto, myAlbum, deletePhoto, likePhoto})=>{
  var photoIDs=photos.map((photo)=>{
    return photo["_id"];
  })
  var photoURLs=photos.map((photo)=>{
    return photo["url"];
  })
  var photoLikes=photos.map((photo)=>{
    return photo["likedby"];
  })
  return(
    <div id="PhotoListDiv">
      {
        photos.map((photo, i)=>{
          return <PhotoCard url={photoURLs[i]} likes={photoLikes[i]}  key={i} showPhoto={showPhoto} myAlbum={myAlbum} photoID={photoIDs[i]} deletePhoto={deletePhoto} likePhoto={likePhoto}/>
        })
      }
    </div>
  )
}
const BottomOptions=({inPhoto, currentPhotoLikeStatement, myAlbum, uploadPhoto, photoID, deletePhoto, likePhoto})=>{
  return(
    <div>
    {
      !inPhoto
      ?(myAlbum
        ?<div id="BottomOptionsDiv">
          <div id="FileChooserDiv">
            <ChooseFileButton/>
          </div>
          <UploadButton uploadPhoto={uploadPhoto}/>
        </div>
        :<div id="BottomOptionsDiv">

        </div>)
      :(myAlbum
        ?<div id="BottomOptionsPhotoDiv">
          <div>
            {currentPhotoLikeStatement}
          </div>
          <button className="ButtonBottomDiv" id={photoID} onClick={deletePhoto} >Delete</button>
        </div>
        :<div id="BottomOptionsPhotoDiv">
          <div>
            {currentPhotoLikeStatement}
          </div>
          <button className="ButtonBottomDiv" id={photoID} onClick={likePhoto}>Like</button>
        </div>)
    }
    </div>
    
  )
}

const BigPhoto=({currentPhoto, closePhoto})=>{
  return(
    <div id="BigPhotoDiv">
      <button id="XButton" onClick={closePhoto}>X</button>
      <img src={currentPhoto} alt='' id="CurrentPhotoDiv"/>
    </div>
  )
}
const AlbumsAndPhotos=({photos, showPhoto, inPhoto, currentPhoto, closePhoto, currentPhotoLikeStatement, myAlbum, uploadPhoto, deletePhoto, photoID, likePhoto})=>{
  return(
    <div id="AlbumsAndPhotosDiv">
      {
        inPhoto
        ?<BigPhoto currentPhoto={currentPhoto} closePhoto={closePhoto}/>
        :<PhotoList photos={photos} showPhoto={showPhoto} myAlbum={myAlbum} deletePhoto={deletePhoto} likePhoto={likePhoto}/>
      }
      <BottomOptions photoID={photoID} inPhoto={inPhoto} currentPhotoLikeStatement={currentPhotoLikeStatement} myAlbum={myAlbum} uploadPhoto={uploadPhoto} deletePhoto={deletePhoto} likePhoto={likePhoto}/>
    </div>
  )
}

const Body=({loggedIn, friends, getPhotos, photos, inAlbum, showPhoto, inPhoto, currentPhoto, closePhoto, currentPhotoLikeStatement, myAlbum, uploadPhoto, deletePhoto, photoID, likePhoto})=>{
  return(
    <div id="BodyDiv">
      <SideBar loggedIn={loggedIn} friends={friends} getPhotos={getPhotos}/>
      {
        inAlbum
        ?<AlbumsAndPhotos photos={photos} showPhoto={showPhoto} inPhoto={inPhoto} currentPhoto={currentPhoto} closePhoto={closePhoto} currentPhotoLikeStatement={currentPhotoLikeStatement} myAlbum={myAlbum} uploadPhoto={uploadPhoto} deletePhoto={deletePhoto} photoID={photoID} likePhoto={likePhoto}/>
        :<div id="AlbumsAndPhotosDiv"></div>
      }
    </div>
  )
}

class App extends React.Component{
  constructor(){
    super();
    this.state={
      loggedIn: false,
      user:'',
      password:'',
      friends:[],
      photos:[],
      inAlbum: false,
      inPhoto: false,
      currentPhotoLikeStatement:'',
      myAlbum:false,
      currentPhotoID:'',
    }
  }

  componentDidMount(){
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3002/init',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      success: function(data, status){
        if(data===""){
        }else{
          this.setState({
            loggedIn: true,
            user: data["username"],
            friends: data["friends"],
          });
        }
      }.bind(this)
    })
  }
  onUserNameChange=(event)=>{
    this.setState({
      user:event.target.value,
    })
  }

  onPasswordChange=(event)=>{
    this.setState({
      password :event.target.value,
    })
  }

  onSubmitLog=(event)=>{
    event.preventDefault();
    if (!this.state.loggedIn){
      if(this.state.user.length>0 && this.state.password.length>0){
        $.ajax({
          type:'POST',
          url: 'http://localhost:3002/login',
          dataType: 'json',
          xhrFields: {
            withCredentials: true
          },
          data:{
            username: this.state.user,
            password: this.state.password,
          },
          success: function(data, status){
            if(data==="Login Failure"){
              window.alert("Error: Login Failure!");
            }else{
              this.setState({
                loggedIn: true,
                user: data["username"],
                friends: data["friends"],
              });
            }
          }.bind(this)
        })
      }else{
        window.alert("Error: Please fill in both fields");
      }
    }else{
      $.ajax({
        type: 'GET',
        url:'http://localhost:3002/logout',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        success: function(data){
          this.setState({
            loggedIn: false,
            user:'',
            password:'',
            friends:[],
            photos:[],
            inAlbum: false,
            inPhoto: false,
            currentPhotoLikeStatement:'',
            currentPhotoID:'',
          })
        }.bind(this)
      })
    }
  }

  getPhotos=(event)=>{
    event.preventDefault();
    var id=event.target.id;
    $(".FriendDiv").css({"background-color": "white", "color": "black"});
    $("#"+id).css({"background-color": "black", "color": "white"});
    if(id==='0'){
      this.setState({
        myAlbum:true,
      })
    }else{
      this.setState({
        myAlbum:false,
      })
    }
    this.setState({
      inAlbum: true,
      inPhoto: false,
    })
    $.ajax({
      type: 'GET',
      url:'http://localhost:3002/getalbum/'+id,
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      success: function(data){
        if (typeof(data)==='object'){
            this.setState({
              photos: data,
            })
          }else{
            this.setState({
              photos: [],
            })
          console.log("Error: Unable to find photos");
          }
      }.bind(this)
    })
  }

  showPhoto=(event)=>{
    var line=event.target.id
    var mainLine=line.split(';');
    this.setState({
      inPhoto: true,
      currentPhoto: mainLine[0],
      currentPhotoLikeStatement:mainLine[1],
      currentPhotoID:mainLine[2],
    })
  }
  closePhoto=()=>{
    this.setState({
      inPhoto: false,
      currentPhoto: '',
      currentPhotoLikeStatement:'',
    })
  }
  uploadPhoto=()=>{
    var photo=$("#filepicker")[0].files;
    if(photo.length>0){
      fetch('http://localhost:3002/uploadphoto', {
        method: 'POST',
        body: photo[0],
        credentials: 'include',
      }).then(r => {
        if(typeof(r)==='object'){
          this.getPhotoAlbum('0');
        }else{
          alert("Error: Unable to upload photo");
        }
      })
    }else{
      alert("Please choose a photo");
    }
    
  }

  deletePhoto=(event)=>{
    var id=event.target.id;
    var url="http://localhost:3002/deletephoto/"+id;
    var del = window.confirm("Are you sure you want to delete this photo?");
    if (del){
      $.ajax({
        type: 'DELETE',
        url: url,
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        success: function(data){
          if (typeof(data)==='object'){
              this.setState({
                photos: data,
              })
            }else{
              alert("Error: Unable to delete photo")
            }
        }.bind(this)
      })
      this.closePhoto();
    }
  }
  likePhoto=(event)=>{
    var id=event.target.id;
    var url="http://localhost:3002/updatelike/"+id;
    $.ajax({
      type: 'PUT',
      url: url,
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      success: function(data){
        if (typeof(data)==='object'){
          var likes=data.likes;
          var userid=data.currentUser;
          var likeStatement="";
          if(likes.length>0){
            for (var i=0; i<likes.length; i++){
              if(i<likes.length-1){
                likeStatement+=likes[i]+", ";
              }else{
                likeStatement+=likes[i]+" ";
              }
            }
            likeStatement+="liked this photo";
            this.setState({
              currentPhotoLikeStatement:likeStatement,
            })
          }

          if(!this.state.inPhoto){
            this.getPhotoAlbum(userid);
          }
        }else{
          alert("Error: Unable to delete photo")
        }
      }.bind(this)
    })
  }
  getPhotoAlbum=(id)=>{
    if(id==='0'){
      this.setState({
        myAlbum:true,
      })
    }else{
      this.setState({
        myAlbum:false,
      })
    }
    this.setState({
      inAlbum: true,
      inPhoto: false,
    })
    $.ajax({
      type: 'GET',
      url:'http://localhost:3002/getalbum/'+id,
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      success: function(data){
        if (typeof(data)==='object'){
            this.setState({
              photos: data,
            })
          }else{
            this.setState({
              photos: [],
            })
          }
      }.bind(this)
    })
  }

  render(){
    const{loggedIn, user, friends, photos, inAlbum, inPhoto, currentPhoto, currentPhotoLikeStatement, myAlbum, currentPhotoID}=this.state;
    return(
      <div className='App' id="AppDiv">
        <Header loggedIn={loggedIn} user={user} onPasswordChange={this.onPasswordChange} onUserNameChange={this.onUserNameChange} onSubmitLog={this.onSubmitLog}/>
        <Body loggedIn={loggedIn} friends={friends} getPhotos={this.getPhotos} photos={photos} inAlbum={inAlbum} showPhoto={this.showPhoto} inPhoto={inPhoto} currentPhoto={currentPhoto} closePhoto={this.closePhoto} currentPhotoLikeStatement={currentPhotoLikeStatement} myAlbum={myAlbum} uploadPhoto={this.uploadPhoto} deletePhoto={this.deletePhoto} photoID={currentPhotoID} likePhoto={this.likePhoto}/>
      </div>
    )
  }
}

export default App;
