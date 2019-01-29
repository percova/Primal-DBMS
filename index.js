const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));
const JsonDB = require('./jsondb');
const jquery = '<script src="jquery.js"></script>'
const db = new JsonDB();

function index(req, res) {
    let tables = db.getTables();
    //db.startAutoFlush(60);
    res.render('index', {tables});
}

function getTable() {
  let fields = db.getFields();
  let records = db.getAll();
  return JSON.stringify({fields, records});
}

function save(req, res) {
    let fields = {};
    for (name in req.query) {
        fields[name] = req.query[name];
    }
    db.set(fields);
    res.send(getTable());
}

function remove(req, res) {
    let id = req.query.id;
    db.delete(id);
    res.send(getTable());
}

function table(req, res) {
    let tableName = req.query.name;
    db.table(tableName);
    res.send(getTable());
}

function flush(req, res) {
    db.flush();
    res.send();
}

function find(req, res) {
    let r;
    for (i in req.query) {
        if (i == 'id') r = JSON.stringify(db.get(req.query[i]))
        else r = JSON.stringify(db.getBy(i, req.query[i]))
    }
    res.send(r);
}

function findOne(req, res) {
    let r;
    for (i in req.query) {
        r = JSON.stringify(db.getOneBy(i, req.query[i]));
    }
    res.send(r);
}

function start(req, res) {
    let time = req.query.time;
    db.startAutoFlush(time);
    res.send();
}

function stop(req, res) {
    //let time = req.query.time;
    db.stopAutoFlush();
    res.send();
}

app.get('/flush', flush);
app.get('/save', save);
app.get('/table', table);
app.get('/remove', remove);
app.get('/find', find);
app.get('/findone', findOne);
app.get('/start', start);
app.get('/stop', stop);
app.get('/', index);

app.listen(3000, () => console.log('Example app listening on port 3000!'));
