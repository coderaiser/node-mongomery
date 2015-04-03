(function() {
    'use strict';
    
    var ruff    = require('ruff'),
        mongodb = require('mongodb').MongoClient;
    
    module.exports = function(fn) {
        var mongo = new Mongo();
        
        return ruff(fn, [mongo]);
    };
    
    function Mongo() {
    }
    
    Mongo.prototype.connect = function(url) {
        var fn =  function(callback) {
            mongodb.connect(url, function(error, db) {
                var _db = new DB(db);
                
                callback(error, _db);
            });
        };
        
        return fn;
    };
    
    function DB(db) {
        this._db = db;
    }
    
    DB.prototype.collection = function(name) {
        var real        = this._db.collection(name),
            collection  = new Collection(real);
        
        return collection;
    };
    
    DB.prototype.close      = function() {
        this._db.close();
    };
    
    function Collection(collection) {
        this._collection = collection;
    }
    
    [
        'insert',
        'update',
        'remove',
    ].forEach(function(name) {
        Collection.prototype[name] = function(param) {
            var collection  = this._collection,
                fnName      = collection[name].bind(collection),
                fn          = thunk(fnName, param);
            
            return fn;
        };
    });
    
    [
        'find',
        'findOne',
    ].forEach(function(name) {
        Collection.prototype[name] = function(param) {
            var real    = this._collection[name](param),
                cursor  = new Cursor(real);
           
           return cursor;
        };
    });
    
    function Cursor(cursor) {
        this._cursor = cursor;
    }
    
    Cursor.prototype.toArray = function() {
        var cursor  = this._cursor,
            fn      = function(callback) {
                cursor.toArray(callback);
            };
        
        return fn;
    };
    
    function thunk(method, param) {
        var fn = function(callback) {
            method(param, callback);
        };
        
        return fn;
    }
    
})();
