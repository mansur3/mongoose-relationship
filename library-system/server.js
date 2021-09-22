const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());


const connect = ()  => {
    return mongoose.connect("mongodb://127.0.0.1:27017/web11");
}



//section schema and model


const sectionSchema = new mongoose.Schema({
    section_name : {type : String, required : true},

})

const Section = mongoose.model("section", sectionSchema);

//Book schema and model 

const bookSchema = new mongoose.Schema({
    name : {type : String, required : true},
    body : {type : String, required : true},
    section : {type: mongoose.Schema.Types.ObjectId, ref : "section", required : true},
    author : [{type : mongoose.Schema.Types.ObjectId, ref : "author", required : true}],
    checkout: {type: mongoose.Schema.Types.ObjectId, ref: "checkout", required : true}

}, {
    varsionKey: false,
    timestamps: true
})

const Book = mongoose.model("book", bookSchema);



// Author schema and model

const authorSchema = new mongoose.Schema({
    first_name : {type : String, required : true},
    last_name : {type : String, required: true}
})

const Author = mongoose.model("author", authorSchema);

//Checkout Schema and model  
const checkoutSchema = new mongoose.Schema({
    checkout : {type : String, required : true},
})


const Checkout = mongoose.model("checkout", checkoutSchema);


///Section crud operation ///


//create  section 

app.post("/section", async (req, res) => {
    const section = await Section.create(req.body);

    return res.status(201).send({section});
})



//read all section       

app.get("/section", async (req, res) => {
    const section = await Section.find().lean().exec();

    return res.status(200).send({section});
})

//read one section   
app.get("/section/:id", async(req, res) => {
    const section = await Section.findById(req.params.id).lean().exec();

    return res.status(200).send({section});
})


//update section  with

app.patch("/section/:id", async(req, res) => {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, {new: true});

    return res.status(200).send({section});
})


//delete section with 

app.delete("/section/:id", async (req, res) => {
    const section = await Section.findByIdAndDelete(req.params.id);

    return res.status(200).send({section});
})



//Book Crud Operation 


//create book

app.post("/book", async (req, res) => {
    const book = await Book.create(req.body);

    return res.status(201).send({book});
})


//read all book   

app.get("/book", async (req, res) => {
    const book = await Book.find().lean().exec();

    return res.status(200).send({book});
})


//read one book  
app.get("/book/:id", async (req, res) => {
    const book = await Book.findById(req.params.id).lean().exec();

    return res.status(200).send({book});
})



//update book
app.patch("/book/:id", async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {new : true});

    return res.status(200).send({book});
})

//delete book 
app.delete("/book/:id" , async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id).lean().exec();

    return res.status(200).send({book});
})



//get all books in a section that are not checkout

app.get("/section/:id/checkout/:d/book", async (req, res) => {
    const book = await Book.find({section : req.params.id, checkout: req.params.d}).populate({
        path: "checkout", 
        select : "checkout"
    }).populate({
        path:"author",
        select : ["first_name", "last_name"]
    }).populate("section").lean().exec();

    return res.status(200).send({book});
})


///get all book in one section

app.get("/section/:id/book", async (req, res) => {
    const book = await Book.find({section : req.params.id}).populate({
        path: "checkout", 
        select : "checkout"
    }).populate({
        path:"author",
        select : ["first_name", "last_name"]
    }).populate("section").lean().exec();

    return res.status(200).send({book});
})




//get all book which are checked out
app.get("/checkout/:id/book", async (req, res) => {
    const book = await Book.find({checkout: req.params.id}).populate({
        path: "checkout", 
        select : "checkout"
    }).populate({
        path:"author",
        select : ["first_name", "last_name"]
    }).populate("section").lean().exec();

    return res.status(200).send({book})
})

/// get all book for an author 

app.get("/author/:id/books", async(req, res) => {
    const book = await Book.find({author: req.params.id}).populate({
        path: "checkout", 
        select : "checkout"
    }).populate({
        path:"author",
        select : ["first_name", "last_name"]
    }).populate("section").lean().exec();
    const author = await Author.findById(req.params.id).lean().exec();

    return res.status(200).send({book, author});

})


///Author CRUD operation 


//create author   

app.post("/author", async (req, res) => {
    const author = await Author.create(req.body);

    return res.status(201).send({author});
})

//GEt all users  
app.get("/author", async (req, res) => {
    const author = await Author.find().lean().exec();

    return res.status(200).send({author});
})


//get single users

app.get("/author/:id", async (req,res) => {
    const author = await Author.findById(req.params.id);

    return res.status(200).send({author});
})


//Update author 
app.patch("/author/:id", async (req, res) => {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {new: true});

    return res.status(200).send({author});
})



//delete author   
app.delete("/author/:id", async (req, res) => {
    const author = await Author.findByIdAndDelete(req.params.id).lean.exec();

    return res.status(200).send({author});
})


//CheckOut CruD operation

//create Checkout

app.post("/checkout", async (req, res) => {
    const checkout = await Checkout.create(req.body);

    return res.status(201).send({checkout});
})


//get all checkout book

app.get("/checkout", async (req, res) => {
    const checkout = await Checkout.find().lean().exec();

    return res.status(200).send({checkout});
})


//get one checkout book 

app.get("/checkout/:id", async (req,res) => {
    const checkout = await Checkout.findById(req.params.id).lean().exec();

    return res.status(200).send({checkout});
})

///update checkout 

app.patch("/checkout/:id", async (req,res) => {
    const checkout = await Checkout.findByIdAndUpdate(req.params.id, req.body, {new : true});

    return res.status(200).send({checkout});
})

//delete checkout 

app.delete("/checkout/:id", async (req, res) => {
    const checkout = await Checkout.findByIdAndDelete(req.params.id);
    return res.status(200).send({checkout});
})






app.listen(1234, async function() {
    await connect();

    console.log("Listening on port 1234");
})