var express= require('express');
var router=express.Router();
const fs = require('fs');
var cookieParser=require('cookie-parser');
const cors= require('cors');
var corsOptions = {
	origin:'http://localhost:3000',
	credentials:true
}

router.use(cookieParser())
router.use(cors(corsOptions));
  
router.get('/init', function(req, res){
    if(req.cookies.userID!==undefined){
        var db=req.db;
        var collection=db.get("userList");
        userID=req.cookies.userID;
        collection.find({"_id": userID}).then((docs)=>{
            if(docs.length>0){
                var usernameUser=docs[0]["username"];
                var friends=docs[0]["friends"];
                var friendUsers=[];
                for(var i=0; i<friends.length; i++){
                    collection.find({"username":friends[i]}).then((users)=>{
                        var frn={"username":users[0]["username"], "_id":users[0]["_id"]};
                        friendUsers.push(frn);
                    }).then(()=>{
                        var toReturn= {
                            "username": usernameUser,
                            "friends": friendUsers,
                        }
                        if (friendUsers.length===friends.length){
                            res.json(toReturn);
                        }
                    })
                }
            }else{
                res.json('Error: Unable to retrieve account');
            }
        })    
    }else{
        res.json("");
    }
});

router.post('/login', function(req, res){
    var username=req.body.username;
    var password=req.body.password;
    var db=req.db;
    var collection=db.get("userList");
    collection.find({"username": username}).then((docs)=>{
        if(docs.length>0){
            if(docs[0]["password"]===password){
                var milliseconds=60*60*1000;
                res.cookie('userID', docs[0]["_id"], { maxAge: 3600000});
                var usernameUser=docs[0]["username"];
                var friends=docs[0]["friends"];
                var friendUsers=[];
                for(var i=0; i<friends.length; i++){
                    collection.find({"username":friends[i]}).then((users)=>{
                        var frn={"username":users[0]["username"], "_id":users[0]["_id"]};
                        friendUsers.push(frn);
                    }).then(()=>{
                        var toReturn= {
                            "username": usernameUser,
                            "friends": friendUsers,
                        }
                        if (friendUsers.length===friends.length){
                            res.json(toReturn);
                        }
                    })
                }    
            }else{
                res.json('Login Failure')
            }
        }else{
            res.json('Login Failure');
        }
    })
})

router.get("/logout", function(req,res){
    res.clearCookie("userID");
    res.json("Logged Out");
})

router.get("/getalbum/:userid", function(req, res){
    var db = req.db;
    collection=db.get("photoList");
    userid=req.params.userid;
    userID=req.cookies.userID;
    if(userid==='0'){
        collection.find({"userid": userID}).then((docs)=>{
            if(docs.length>0){
                res.json(docs);
            }else{
                res.json("Error: Unable to retrieve photos");
            }
        })
    }else{
        collection.find({"userid": userid}).then((docs)=>{
            if(docs.length>0){
                res.json(docs);
            }else{
                res.json("Error: Unable to retrieve photos");
            }
        })
    }
})

router.post('/uploadphoto', function(req, res){
    //need cookies
    userID=req.cookies.userID;
    var db = req.db;
    collection=db.get("photoList")
    x=Math.floor(Math.random()*1000)+7;
    y=Math.floor(Math.random()*200)+12;
    xy=x.toString()+y.toString();
    var writeStream = fs.createWriteStream('./public/uploads/'+xy+'.jpg');
    req.pipe(writeStream);
    collection.insert({'url': 'http://localhost:3002/uploads/'+xy+'.jpg', 'userid': userID, 'likedby':[]}).then(()=>{
        collection.find({'url': 'http://localhost:3002/uploads/'+xy+'.jpg'}).then((docs)=>{
            if(docs.length>0){
                res.json(docs);
            }else{
                res.json("Error: Unable to upload photo");
            }
        })
    }).catch(()=>{
        res.json("Error: Unable to upload photo");
    });
})

router.delete("/deletephoto/:photoid", function(req, res){
    var db = req.db;
    userID=req.cookies.userID;
    collection=db.get("photoList");
    collection.find({"_id":req.params.photoid}).then((docs)=>{
        var url=docs[0]["url"];
        var path="./public"+url.slice(21);
        fs.unlink(path, (error)=>{
            if(error){
                res.json("Error: Unable to delete photo");
            }
        })
        collection.remove({"_id":req.params.photoid}).then(()=>{
            collection.find({"userid": userID}).then((docs)=>{
                if(docs.length>0){
                    res.json(docs);
                }else{
                    res.json("Error: Unable to retrieve photos");
                }
            })
        }).catch(()=>{
            res.json("Error: Unable to delete photos");
        })
    })
})

router.put('/updatelike/:photoid', function(req,res){
    var db = req.db;
    collection=db.get("userList");
    userID=req.cookies.userID;
    collection.find({"_id":userID}).then((docs)=>{
        collection=db.get("photoList");
        var username=docs[0]["username"];
        collection.find({"_id":req.params.photoid}).then((result)=>{
            if(!result[0]["likedby"].includes(username)){
                var likedby=result[0]["likedby"].push(username)
            }
            currentUser=result[0]["userid"];
            var likes=result[0]["likedby"];
            collection.update({"_id":req.params.photoid}, {$set:{"likedby":likes}}).then((result, err)=>{
                res.json({
                    likes,
                    currentUser,
                });
            }).catch(()=>{
                res.json("Error: Unable to like the photo");
            })
        })
    })
    
})



module.exports=router;