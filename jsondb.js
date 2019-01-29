const fs = require('fs');

function JsonDB(file = './db.json') {
  this.file = file;

  try {
    let jsonds = fs.readFileSync(file, 'utf8');
    this.ds = JSON.parse(jsonds);
  } catch(e) {
    this.ds = {};
  }

  this.getTables = function() {
    return Object.keys(this.ds);
  }

  this.table = function(table) {
    if (!this.ds[table]) this.ds[table] = [];  
    this._table = this.ds[table];
    return this;
  }

  this.delete = function(id) {
    this._table[id] = {};
  }

  this.getAll = function() {
    return this._table;
  }

  this.get = function(id) {
    let record = this._table[id];
    if (record) return {id, ...record};
    return undefined;
  };

  this.getBy = function(field, value) {
    const matches = [];
    for (id in this._table) {
      let record = this._table[id];
      if (record[field] == value)
        matches.push({id, ...record});
    }

    return matches;
  }

  this.getOneBy = function(field, value) {
    for (id in this._table) {
      let record = this._table[id];
      if (record[field] == value)
        return {id, ...record};
    }

    return undefined;
  }

  this.set = function(value) {
    let id = value.id;
    delete value.id;
    if (id) {
      let record = this._table[id];
      this._table[id] = Object.assign(record, value);
    } else {
      id = this._table.push(value);
    }
    return {id, ...value};
  };

  this.getFields = function() {
    let fields = [];
    for (id in this._table) {
      let record = this._table[id];
      for (field in record) {
        if (fields.indexOf(field) === -1 && field !== 'id') fields.push(field);
      }
    }

    return fields;
  }

  this.flush = function() {
    fs.writeFileSync(this.file, JSON.stringify(this.ds));
  };

  this.startAutoFlush = function(interval) {
    this.autoFlush = setInterval(this.flush.bind(this), interval * 1000);
  };

  this.stopAutoFlush = function() {
    clearInterval(this.autoFlush);
  }
};

  this.grouper = function() {
      let students = db.table('students').getAll();
      for (stud in students) {
        let prepod = db.table('teachers').getBy('group', stud.group);
        let prepodName = prepod.name;
        db.table('newtable').set({prepodName, ...stud})
      }   
  }

module.exports = JsonDB;
