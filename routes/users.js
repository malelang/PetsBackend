var express =require('express');
var router = express.Router();
var ObjectID=require('mongodb').ObjectID;

router.use((req,res,next)=>{
    req.collection = req.db.collection('users');
    next();
})

router.get("/", (req, res, next) => {
    req.collection.find().toArray().then(data => {
        res.send(data);
    }).catch(err => {
        res.send([]);
    });
});


router.get("/:id",(req,res,next)=>{
    let id= req.params.id;
    req.collection.findOne({_id: new ObjectID(id)})
    .then(result=>{
        if(result){
            res.send(result);
        }else{
            res.status(404).send({err:"Usuario no encontrado"})
        }
    })
    .catch(err=>{
        res.status(500).send({err:"Error al leer usuarios "})
    });
});

router.post("/",(req,res,next)=>{
    let body=req.body; // asi obtengo la info que viaja a traves del método post
    req.collection.insertOne(body)
    .then(result=>{
        res.send({success: true})
    }).catch(err=>{
        res.send({success:false})
    })
});

router.put("/:id",(req,res,next)=>{
    let body=req.body;
    let id= new ObjectID(req.params.id)
    req.collection.updateOne({_id:id},{$set:body})
    .then(result=>res.send({success:true}))
    .catch(err=>res.send({success:false}));
});

router.delete("/:id",(req,res,next)=>{
    let id=new ObjectID(req.params.id);
    req.collection.deleteOne({_id:id})
    .then(result=>res.send({success:true}))
    .catch(err=>res.send({success:false}))
});

module.exports =router;