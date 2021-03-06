(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cozysdk = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
var client, promiser;

client = require('./utils/client');

promiser = require('./utils/promiser');


/**
 <h2>cozysdk functions to manipulate document binaries</h2>

 Binaries can be attached to a document.
 Attaching binaries is not supported in cozysdk for browser, if your
 application needs to create document with binaries, you will need to create
 a full node.js application.

 @module binaries
 */


/**
Delete binary linked to the document matching ID. Several binaries
can be attached to a document, so a name is required to know which file
should be deleted.

@function

@arg {string} docType - The docType of the document to remove a binary from.
@arg {string} id - The id of the document to remove a binary from.
@arg {string} name - The name of the binary to destroy.
@arg {callback} [callback] - A node.js style callback

@example <caption>callback</caption>
cozysdk.removeBinary('Note', '524noteid452', 'image.jpg', function(err){
    // image.jpg has been removed from note 524noteid452
});
@example <caption>promise</caption>
cozysdk.removeBinary('Note', '524noteid452', 'image.jpg')
 */

module.exports.removeBinary = promiser(function(docType, id, name, callback) {
  var path;
  path = "/data/" + id + "/binaries/" + name;
  return client.del(path, {}, function(error, response, body) {
    if (error) {
      return callback(error);
    } else if (response.status !== 204) {
      return callback(new Error("" + response.status + " -- Server error occured."));
    } else {
      return callback(null, body);
    }
  });
});


/**
Build file url for file linked to the document matching ID. Several binaries
can be attached to a document, so a name is required to know which file
should be retrieved.

@function

@arg {string} docType - The docType of the document to retrieve a binary from.
@arg {string} id - The id of the document to retrieve a binary from.
@arg {string} name - The name of the binary to retrieve.
@arg {callback} [callback] - A node.js style callback

@example <caption>callback</caption>
cozysdk.getBinaryURL('Note', '524noteid452', 'image.jpg', function(err, url){
    img.src = url
});
@example <caption>promise</caption>
cozysdk.getBinaryURL('Note', '524noteid452', 'image.jpg')
 */

module.exports.getBinaryURL = promiser(function(docType, id, name, callback) {
  var host, path;
  path = "/ds-api/data/" + id + "/binaries/" + name;
  host = window.location.host;
  return client.getToken(function(err, auth) {
    var url;
    if (err) {
      return callback(err);
    }
    auth = "Basic " + btoa("" + auth.appName + ":" + auth.token);
    url = "" + window.location.protocol + "//" + host + path;
    url += "?authorization=" + auth;
    return callback(null, encodeURI(url));
  });
});

},{"./utils/client":5,"./utils/promiser":6}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
var client, promiser;

client = require('./utils/client');

promiser = require('./utils/promiser');


/**
 <h2>Cozysdk CRUD functions</h2>

<ul>
<li>Create a document [cozysdk.create]{@link module:crud.create }</li>
<li>Find a document [cozysdk.find]{@link module:crud.find }</li>
<li>Update a document
    [cozysdk.updateAttributes]{@link module:crud.updateAttributes}</li>
<li>Delete a document [cozysdk.destroy]{@link module:crud.destroy }</li>
</ul>

 @module crud

 @tutorial doctype
 */


/**
Creates a new document for given doc type with fields given
in the attributes object.

@function
@arg {string} docType - The doctype you want to create.
@arg {Object} attributes - The attributes your document should have.
@arg {callback} [callback] - A node.js style callback

@example <caption>callback</caption>
var attributes = {title:"hello", content:"world"}
cozysdk.create('Note', attributes, function(err, obj){
    console.log(obj.id)
});
@example <caption>promise</caption>
var attributes = {title:"hello", content:"world"}
cozysdk.create('Note', attributes)
    .then(function(obj){ console.log(obj.id) } );
 */

module.exports.create = promiser(function(docType, attributes, callback) {
  attributes.docType = docType;
  if (attributes.id != null) {
    return callback(new Error('cant create an object with a set id'));
  }
  return client.post("data/", attributes, function(error, response, body) {
    if (error) {
      return callback(new Error("" + response.status + " -- " + body.id + " -- " + error));
    } else {
      return callback(null, JSON.parse(body));
    }
  });
});


/**
Retrieve a document by its ID.

@function
@arg {string} docType - The doctype you want to create.
@arg {string} id - The id of the document you want to retrieve.
@arg {callback} [callback] - A node.js style callback

@example <caption>callback</caption>
cozysdk.find('Note', '732732832832', function(err, note){ note.title });
@example <caption>promise</caption>
cozysdk.find('Note', '732732832832').then( function(note){ note.title } );
 */

module.exports.find = promiser(function(docType, id, callback) {
  return client.get("data/" + id + "/", null, function(error, response, body) {
    if (error) {
      return callback(error);
    } else if (response.status === 404) {
      return callback(new Error("" + response.status + " -- " + body.id + " -- Error in finding object"));
    } else {
      return callback(null, JSON.parse(body));
    }
  });
});


/**
Update attributes of the document that matches given doc type and given ID..

@function
@arg {string} docType - The doctype of the document you want to change.
@arg {string} id - The id of the document you want to change.
@arg {Object} attrs - The changes you want to make.
@arg {callback} [callback] - A node.js style callback

@example <caption>callback</caption>
cozysdk.find('Note', '732732832832', function(err, note){
    console.log(note) // {title: "hello", content: "world"}
    var changes = {title: "Hola"};
    cozysdk.updateAttributes('Note', '732732832832', changes, function(){
        // note now is {title: "Hola", content: "world"}
    });
});
@example <caption>promise</caption>
cozysdk.find('Note', '732732832832')
.then( function(note){
    var changes = {title: "Hola"};
    return cozysdk.updateAttributes('Note', '732732832832', changes)
} )
.then( function(){
    // note now is {title: "Hola", content: "world"}
})
 */

module.exports.updateAttributes = promiser(function(docType, id, attrs, callback) {
  attrs.docType = docType;
  return client.put("data/merge/" + id + "/", attrs, function(error, response, body) {
    if (error) {
      return callback(error);
    } else if (response.status === 404) {
      return callback(new Error("Document " + id + " not found"));
    } else if (response.status !== 200) {
      return callback(new Error("" + response.status + " -- " + body.id + " -- Server error occured."));
    } else {
      return callback(null, JSON.parse(body));
    }
  });
});


/**
Delete a document by its ID.

@function
@arg {string} docType - The doctype you want to destroy.
@arg {string} id - The id of the document you want to destroy.
@arg {callback} [callback] - A node.js style callback

@example <caption>callback</caption>
cozysdk.destroy('Note', '732732832832' function(err){
    // note has been destroyed
});
@example <caption>promise</caption>
cozysdk.destroy('Note', '732732832832')
.then( function(note){
    // note has been destroyed
})
 */

module.exports.destroy = promiser(function(docType, id, callback) {
  return client.del("data/" + id + "/", null, function(error, response) {
    if (error) {
      return callback(error);
    } else if (response.status === 404) {
      return callback(new Error("Document " + id + " not found"));
    } else if (response.status !== 204) {
      return callback(new Error("" + response.status + " -- " + id + " -- Server error occured."));
    } else {
      return callback(null);
    }
  });
});

},{"./utils/client":5,"./utils/promiser":6}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
var binaries, cozysdk, crud, requests;

cozysdk = exports;

crud = require('./crud');

binaries = require('./binaries');

requests = require('./requests');


/**
 Create Read Update Delete Documents
 */

cozysdk.create = crud.create;

cozysdk.find = crud.find;

cozysdk.updateAttributes = crud.updateAttributes;

cozysdk.destroy = crud.destroy;


/**
 MapReduce Views Management
 */

cozysdk.defineView = requests.defineMapReduceView;

cozysdk.queryView = requests.queryView;

cozysdk.destroyByView = requests.destroyByView;


/**
 Binaries Management
 */

cozysdk.destroyBinary = binaries.deleteBinary;

cozysdk.getBinaryURL = binaries.getBinaryURL;

cozysdk.defineRequest = requests.defineMapReduceView;

cozysdk.run = requests.queryView;

cozysdk.destroyRequest = requests.destroyByView;

cozysdk.deleteFile = function(id, name, cb) {
  return binaries.deleteBinary(null, id, name, cb);
};

cozysdk.getFileURL = function(id, name, cb) {
  return binaries.getBinaryURL(null, id, name, cb);
};

},{"./binaries":1,"./crud":2,"./requests":4}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
var client, promiser;

client = require('./utils/client');

promiser = require('./utils/promiser');


/**
 A node.js style callback.
 @callback callback
 @param {Error} error
 @param {*} [result]
 */


/**
 <h2>cozysdk Map Reduce functions</h2>

 Queries in cozy are made using couchdb map/reduce view system.
 Read more in the [tutorial]{@tutorial mapreduce}.

 @module mapreduce
 @tutorial mapreduce
 */


/**
Define a map/reduce request for a given doc type.

@function

@arg {string} docType - The doctype you want to create a view on.
@arg {string} name - The name of the view to create.
@arg {string|Function|Object} request - The request to define. it can either be
        a function, a string (function.toString()) or an object with
        map & reduce attributes.
@arg {Function} request._ - A map function, taking doc as parameter.
@arg {String} request._ - The same function as a string (.toString)
@arg {Object} request._ - An object with both map & reduce functions.
@arg {callback} [callback] - A node.js style callback

@warning Your app needs the permission on the doctype passed as argument.

@example <caption>callback</caption>
byTitle = function(doc) { emit(doc.title); }
cozysdk.defineMapReduceView('Note', 'all', byTitle, function(err){
    // view has been created
});
@example <caption>promise</caption>
byTitle = function(doc) { emit(doc.title); }
cozysdk.defineMapReduceView('Note', 'all', byTitle)
 */

module.exports.defineMapReduceView = promiser(function(docType, name, request, callback) {
  var map, path, reduce, reduceArgsAndBody, view, _ref;
  if ((_ref = typeof request) === 'function' || _ref === 'string') {
    request = {
      map: request
    };
  }
  map = request.map, reduce = request.reduce;
  if ((reduce != null) && typeof reduce === 'function') {
    reduce = reduce.toString();
    reduceArgsAndBody = reduce.slice(reduce.indexOf('('));
    reduce = "function " + reduceArgsAndBody;
  }
  view = {
    reduce: reduce,
    map: "function (doc) {\n    if (doc.docType.toLowerCase() === \"" + (docType.toLowerCase()) + "\") {\n        filter = " + (map.toString()) + ";\n        filter(doc);\n    }\n}"
  };
  path = "request/" + docType + "/" + (name.toLowerCase()) + "/";
  return client.put(path, view, function(error, response, body) {
    var err, msgStatus;
    if (error) {
      return error;
    } else if (response.status !== 200) {
      msgStatus = "expected: 200, got: " + response.status;
      err = new Error("" + msgStatus + " -- " + body.error + " -- " + body.reason);
      err.status = response.status;
      return callback(err);
    } else {
      return callback(null, body);
    }
  });
});


/**
Query a map/reduce view.
It accepts CouchDB like params.

@function

@arg {string} docType - The doctype you want to query a view on.
@arg {string} name - The name of the view to query.
@arg {Object} params - The query parameters.
@param {mixed} [params.key] - get all entries with this key
@param {mixed[]} [params.keys] - get all entries with one of these keys
@param {mixed} [params.startkey] - get all entries with key greater than this
        value
@param {String} [params.startkey_docid] - document id to start with (to allow
        pagination for duplicate startkeys)
@param {mixed} [params.endkey] - get all entries with key lesser than this value
@param {String} [params.endkey_docid] - last document id to include in the
        output (to allow pagination for duplicate endkeys)
@param {Number} [params.limit=Infinity] - Limit the number of documents in
        the output
@param {Number} [params.skip=0] - skip n number of documents
@param {Boolean} [params.descending=false] - change the direction of search
@param {Boolean} [params.group=false] - The group option controls whether
        the reduce function reduces to a set of distinct keys or to a single
        result row.
@param {Number} [params.group_level] - see below
@param {Boolean} [params.reduce=true] - use the reduce function of the view.
        It defaults to true, if a reduce function is defined and to false
        otherwise.
@param {Boolean} [params.include_docs=false] - automatically fetch and include
        the document which emitted each view entry
@param {Boolean} [params.inclusive_end=true] - Controls whether the endkey is
        included in the result. It defaults to true.
@param {Boolean} [params.update_seq=] - Response includes an update_seq value
        indicating which sequence id of the database the view reflects
@arg {callback} [callback] - A node.js style callback

@example <caption>callback</caption>
params = {startkey 'A', endkey: 'B'}
cozysdk.queryView('Note', 'byTitle', params, function(err){
    // get all notes with a title starting by A
});
@example <caption>promise</caption>
params = {startkey 'A', endkey: 'B'}
cozysdk.queryView('Note', 'byTitle', params)
 */

module.exports.queryView = function(docType, name, params, callback) {
  var path, _ref;
  if (typeof params === 'function') {
    _ref = [{}, params], params = _ref[0], callback = _ref[1];
  }
  path = "request/" + docType + "/" + (name.toLowerCase()) + "/";
  return client.post(path, params, function(error, response, body) {
    if (error) {
      return callback(error);
    } else if (response.status !== 200) {
      return callback(new Error("" + response.status + " -- Server error occured."));
    } else {
      return callback(null, JSON.parse(body));
    }
  });
};


/**
Destroy every documents that would have been returned by a call to
[queryView]{@link module:mapreduce.queryView} with the same parameters.
Destroy all DocumentsQuery a map/reduce view.
It accepts CouchDB like params.

@function
@arg {string} docType - The doctype you want to query a view on.
@arg {string} name - The name of the view to query.
@arg {Object} params - The same query parameters than
        [queryView]{@link module:mapreduce.queryView}.
@arg {Object} params.limit - <strong>Warning</strong> The limit param is
        ignored for deletion.
@arg {callback} [callback] - A node.js style callback

@example <caption>callback</caption>
params = {startkey 'A', endkey: 'B'}
cozysdk.destroyByView('Note', 'byTitle', params, function(err){
    // destroy all notes with a title starting by A
});
@example <caption>promise</caption>
params = {startkey 'A', endkey: 'B'}
cozysdk.destroyByView('Note', 'byTitle', params)
 */

module.exports.destroyByView = function(docType, name, params, callback) {
  var path, _ref;
  if (typeof params === 'function') {
    _ref = [{}, params], params = _ref[0], callback = _ref[1];
  }
  path = "request/" + docType + "/" + (name.toLowerCase()) + "/destroy/";
  return client.put(path, params, function(error, response, body) {
    var err, msgStatus;
    if (error) {
      return error;
    } else if (response.status !== 204) {
      msgStatus = "expected: 204, got: " + response.status;
      err = new Error("" + msgStatus + " -- " + body.error + " -- " + body.reason);
      err.status = response.status;
      return callback(err);
    } else {
      return callback(null, body);
    }
  });
};

},{"./utils/client":5,"./utils/promiser":6}],5:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
var getToken, playRequest;

getToken = function(callback) {
  var receiveToken, _ref;
  receiveToken = function(event) {
    var appName, token, _ref;
    window.removeEventListener('message', receiveToken);
    _ref = event.data, appName = _ref.appName, token = _ref.token;
    if (typeof callback === "function") {
      callback(null, {
        appName: appName,
        token: token
      });
    }
    return callback = null;
  };
  if (window.parent == null) {
    return callback(new Error('no parent window'));
  }
  if (!((_ref = window.parent) != null ? _ref.postMessage : void 0)) {
    return callback(new Error('get a real browser'));
  }
  window.addEventListener('message', receiveToken, false);
  return window.parent.postMessage({
    action: 'getToken'
  }, '*');
};

playRequest = function(method, path, attributes, callback) {
  return getToken(function(err, auth) {
    var basicHeader, xhr;
    if (err) {
      return callback(err);
    }
    xhr = new XMLHttpRequest;
    xhr.open(method, "/ds-api/" + path, true);
    xhr.onload = function() {
      return callback(null, xhr, xhr.response);
    };
    xhr.onerror = function(e) {
      err = "Request failed : " + e.target.status;
      return callback(err);
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    basicHeader = "Basic " + (btoa(auth.appName + ':' + auth.token));
    xhr.setRequestHeader('Authorization', basicHeader);
    if (attributes != null) {
      return xhr.send(JSON.stringify(attributes));
    } else {
      return xhr.send();
    }
  });
};

module.exports = {
  get: function(path, attributes, callback) {
    return playRequest('GET', path, attributes, function(error, response, body) {
      return callback(error, response, body);
    });
  },
  post: function(path, attributes, callback) {
    return playRequest('POST', path, attributes, function(error, response, body) {
      return callback(error, response, body);
    });
  },
  put: function(path, attributes, callback) {
    return playRequest('PUT', path, attributes, function(error, response, body) {
      return callback(error, response, body);
    });
  },
  del: function(path, attributes, callback) {
    return playRequest('DELETE', path, attributes, function(error, response, body) {
      return callback(error, response, body);
    });
  },
  getToken: getToken
};

},{}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
module.exports = function(fn) {
  var promiseSupport;
  promiseSupport = 'undefined' !== typeof Promise;
  if (!promiseSupport) {
    return fn;
  }
  return function() {
    var arg, args;
    if ('function' === typeof arguments[arguments.length - 1]) {
      return fn.apply(this, arguments);
    }
    args = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        _results.push(arg);
      }
      return _results;
    }).apply(this, arguments);
    return new Promise((function(_this) {
      return function(resolve, reject) {
        args.push(function(err, result) {
          if (err) {
            return reject(err);
          } else {
            return resolve(result);
          }
        });
        return fn.apply(_this, args);
      };
    })(this));
  };
};

},{}]},{},[3])(3)
});
//# sourceMappingURL=cozysdk-client.js.map
