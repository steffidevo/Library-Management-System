var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://Steffan:S1234d1234@ds127883.mlab.com:27883/library_management_ucsc',['books']);


//Get all books
router.get('/books', function(req, res, next){
    db.books.find(function(err,books){
        if(err){
            res.send(err);
        }
        res.json(books);
    });
});



//Get a Single Book
router.get('/book/:id', function(req, res, next){
    db.books.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err,book){
        if(err){
            res.send(err);
        }
        res.json(book);
    });
});



//Save a Book
router.post('/book', function(req, res, next){
    var book = req.body;
    if(!book.title || !(book.isBooked + '')){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    }else {
        db.books.save(book, function(err,book){
            if(err){
                res.send(err);
            }
            res.json(book); 
        });
    }
    
});

//Delete Book
router.delete('/book/:id', function(req, res, next){
    db.books.remove({_id: mongojs.ObjectId(req.params.id)}, function(err,book){
        if(err){
            res.send(err);
        }
        res.json(book);
    });
});


//Update book
router.post('/book/:id', function(req, res, next){
    var book = {
        title: req.body.title,
        description:req.body.description,
        section: req.body.section,
        description:req.body.description,
        copies:req.body.copies
    };
    db.books.update(req.params.id,{$set:book},{new:true},(err,book)=>{
        if(err){
            res.send(err);
        }
        res.json(book);
    });
});



//updatecopies
router.put('/book', function(req, res, next){ 
    var id = req.body[0];
    var copies = req.body[1];
    db.books.update({_id:mongojs.ObjectId(id)},{$set:{copies:copies}},
    function(err,book){
        if(err){
            res.send(err);
        }
        res.json(book);
    });
});

module.exports = router;