# git-credential-node

Node library that allows using the [Git credential API](http://git-scm.com/docs/git-credential).

## Installation

```bash
npm install --save git-credential-node
```

## How it works

This is a thin wrapper around the `git credential` command.

The library use the GIT_TERMINAL_PROMPT environment variable to
avoid asking the user credential on stdin.

The option is avalable starting with git 2.3, so you must have this version of git intalled on your system (or a newer one).

See [detail on the option here](https://github.com/blog/1957-git-2-3-has-been-released)

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
import { fill } from 'git-credential-node';
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
import { approve } from 'git-credential-node';
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
import { reject } from 'git-credential-node';
reject('http://foo/bar.git', err => {
  if (err) {
    return console.log(err.message);
  }

  console.log('credentials removed!');
});
```


## Promises usage

Example of use of the async functions with promise.

All functions resolve or reject the returned promise with the same arguments passed
to the callback.
We use es2016 proposed async function in these example for clarity, but this is obviously
not required.
Any other comment specified in the callback section apply also to the promise usage.

### fill(url)

Example:

```javascript
import { fill } from 'git-credential-node';

async function example() {
  try {

    const data = await fill('http://foo/bar.git');

    if (!data) {
      console.log('credentials not stored!');
    }
    return data;

  } catch (err) {
    console.log(err.message);
  }
}
```

### approve(options)

Example:

```javascript
import { approve } from 'git-credential-node';

async function example() {
  const opts = {
    username: 'user',
    password: 'pass',
    url: 'http://foo/bar.git'
  };

  try {
    await approve(opts);

  } catch (err) {
    return console.log(err.message);
  }

  console.log('credentials stored!');
});
```

### reject(url, callback)

Example:

```javascript
import { reject } from 'git-credential-node';

async function example() {
  try {
    await reject('http://foo/bar.git');

  } catch (err) {
    return console.log(err.message);
  }

  console.log('credentials removed!');
});
```



## Sync usage

Example of use of the sync functions.

All functions hasve a synchronous counterpart, with name ending in `Sync`.
These can be particulary useful to use within bin scripts.

Any other comment specified in the callback section apply also to the sync functions.

### fillSync(url)

Example:

```javascript
import { fillSync } from 'git-credential-node';

function example() {
  try {

    const data = fillSync('http://foo/bar.git');

    if (!data) {
      console.log('credentials not stored!');
    }
    return data;

  } catch (err) {
    console.log(err.message);
  }
}
```

### Sync(options)

Example:

```javascript
import { Sync } from 'git-credential-node';

function example() {
  const opts = {
    username: 'user',
    password: 'pass',
    url: 'http://foo/bar.git'
  };

  try {
    Sync(opts);

  } catch (err) {
    return console.log(err.message);
  }

  console.log('credentials stored!');
});
```

### rejectSync(url, callback)

Example:

```javascript
import { rejectSync } from 'git-credential-node';

function example() {
  try {
    rejectSync('http://foo/bar.git');

  } catch (err) {
    return console.log(err.message);
  }

  console.log('credentials removed!');
});
```

## License

MIT - © 2015 Andrea Parodi
