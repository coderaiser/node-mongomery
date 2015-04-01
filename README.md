Mongomery
=======

Generator based flow-control driver for [MongoDB](http://mongodb.org "MongoDB").

## Install

`npm i mongomery --save`

## How come?

With help of `ES6` generators flow-control of interaction with `MongoDB` could be much simpler.
`Mongomery` will save your code from [callback hell](http://callbackhell.com/ "Callback Hell").

## Hot to use?

```js
var mongomery = require('mongomery');

mongomery(function*(mongo) {
    var url         = 'mongodb://localhost:27017/myproject',
        db          = yield mongo.connect(url),
        collection  = db.collection('mongolog'),
        docs        = yield collection.find({}).toArray();
        
    docs.forEach(function(item) {
        console.log(item);
    });
    
    db.close();
}).on('error', function(error) {
    console.log(error.message);
});
```

## License

MIT

