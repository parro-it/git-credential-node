# git-credential-node

Node library that allows using the [Git credential API](http://git-scm.com/docs/git-credential).

## Installation

```bash
npm install --save git-credential-node
```

## Usage

The library provides the following functions that can be used to interact with a locally installed Git credential tool.
All functions with names ending in `sync` are synchronous, and either return the result of operation or throws.
All other functions are asynchronous and could be used in one of two ways:
  * a callback could be provided as last argument which is called with the error or the results of the operation as arguments, following the standard node semantic.
  * a promise is returned that is either resolved with results, or rejected with errors.


### fill(url, callback)

Retrieves any stored credentials for the provided target server.

* `url`: A `String` parameter indicating the URL of the target server, e.g. https://github.com
* `callback`: Called when the call to the Git credential tool finishes.

The provided `callback` is called with two parameters:

* `err`: An error object in case the call failed.
* `result`: { username, password }, containing the stored credentials. If there aren't any stored credentials for the requested target server, result will be null.

When there aren't any stored credentials for the requested target server, the Git credential helper will **not** ask for credentials, it will simply provide an empty result object to the callback.

Example:

```javascript
import fill from 'git-credential-node';
fill('http://foo/bar.git', (err, data) => {
  if (err) {
    return console.log(err.message);
  }
  if (!data) {
    console.log('credentials not stored!');
  }
  console.dir(data);
});
```

### approve(options, callback)

Stores the provided credentials for the provided target server. The following parameters are expected:


* `options`: { username, password, url } An object containing `username` and `password` properties with the credentials to be stored, and `url` indicating the URL of the target server.
* `callback`: Called when the call to the Git credential tool finishes.

The provided `callback` is called with one parameters:

* `err`: An error object in case the call failed. If it is null, it means the call has succedeed.

Example:

```javascript
import approve from 'git-credential-node';
const opts = {
  username: 'user',
  password: 'pass',
  url: 'http://foo/bar.git'
};

approve(opts, err => {
  if (err) {
    return console.log(err.message);
  }

  console.log('credentials stored!');
});
```

### reject(url, callback)

Removes any stored credentials for the provided target server. The following parameters are expected:


* `url`: A `String` parameter indicating the URL of the target server, e.g. https://github.com
* `callback`: Called when the call to the Git credential tool finishes.

The provided `callback` is called with one parameters:

* `err`: An error object in case the call failed. If it is null, it means the call has succedeed.

Example:

```javascript
import reject from 'git-credential-node';
reject('http://foo/bar.git', err => {
  if (err) {
    return console.log(err.message);
  }

  console.log('credentials removed!');
});
```

## License

MIT - © 2015 Andrea Parodi
