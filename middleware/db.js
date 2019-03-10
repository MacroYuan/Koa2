var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {});

//用户数据库
var loginSchema = new mongoose.Schema({
    username: String,
    password: String
});
var login = db.model("login", loginSchema, "login");

//留言数据库
var noteSchema = new mongoose.Schema({
    content: String,
    id: String
});
var note = db.model("note", noteSchema, "note")

async function validateLogin(name, psw) {
    console.log(psw);
    var pass = '';
    await login.find({ username: name }).then(function(doc) {
        console.log("doc");
        pass = doc[0].password;
        console.log(pass);
    })
    if (psw === pass) {
        return true;
    }
    return false;
}

async function insertUser(username, password) {
    var user = new login({ username: username, password: password });
    console.log("chaRu");
    await user.save().then(function(doc) {
        console.log(doc);
        if (doc) {
            return true;
        }
    })
    return false;
}

async function getNote() {
    let results = [];
    await note.find().then(function(doc) {
        results = doc;
    });
    return results;
}

async function queryMaxID() {
    let temp = 0;
    await note.find({}).sort({ 'id': -1 }).limit(1).then(function(doc) {
        if (doc.length > 0) {
            temp = doc[0].id
        } else {
            console.log("collection is empty");
        }
    });
    return temp;
}

async function insertNote(content) {
    let value = await queryMaxID();
    var record = new note({ content: content, id: ++value });

    await record.save().then(function(err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Insert done");

    });
    return value;
}

async function deleteNoteId(id) {
    let query = { id: id };
    console.log(query);
    await note.remove(query).then(function(doc) {
        console.log("done");
    });
}

async function readNoteId(id) {
    let content;
    await note.find({ id: id }).then(function(doc) {
        content = doc[0];
    })
    return content;
}

var dbAPI = {
    validate: validateLogin,
    insert: insertUser,
    getNote: getNote,
    deleteNoteId: deleteNoteId,
    insertNote: insertNote,
    readNoteId: readNoteId,
}

module.exports = dbAPI;