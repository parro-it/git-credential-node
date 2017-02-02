'use strict';
const execa = require('execa');

const credentialRE = /username=([^\n]+)\npassword=([^\n]+)\n/;

function callbackOrPromise(cb, promise) {
	if (cb) {
		promise
			.then(data => cb(null, data))
			.catch(cb);
		return null;
	}

	return promise;
}

function parse(result) {
	const match = result.match(credentialRE);
	if (!match) {
		return null;
	}
	const username = match[1];
	const password = match[2];

	return {username, password};
}

const fillOpts = url => ({
	stripEof: false,
	reject: false,
	encoding: 'utf8',
	input: url ? `url=${url}\n\n` : '\n',
	env: Object.assign({GIT_TERMINAL_PROMPT: '0'}, process.env)
});

exports.fillSync = url => {
	try {
		const result = execa.sync('git', ['credential', 'fill'], fillOpts(url));
		return parse(result.stdout);
	} catch (err) {
		return null;
	}
};

exports.fill = (url, cb) => callbackOrPromise(
	cb,
	execa('git', ['credential', 'fill'], fillOpts(url))
		.then(({code, stdout}) => {
			if (code !== 0) {
				return null;
			}

			return parse(stdout);
		})
);

const rejectOpts = url => ({
	stripEof: false,
	encoding: 'utf8',
	input: url ? `url=${url}\n\n` : '\n'
});

exports.rejectSync = url => {
	return execa.sync('git', ['credential', 'reject'], rejectOpts(url));
};

exports.reject = (url, cb) => callbackOrPromise(
	cb,
	execa('git', ['credential', 'reject'], rejectOpts(url))
);

const approveOpts = ({username, password, url}) => ({
	stripEof: false,
	encoding: 'utf8',
	input: (url ? `url=${url}\n` : '') +
		`username=${username}\npassword=${password}\n\n`
});

exports.approveSync = args => {
	return execa.sync('git', ['credential', 'approve'], approveOpts(args));
};

exports.approve = (args, cb) => callbackOrPromise(
	cb,
	execa('git', ['credential', 'approve'], approveOpts(args))
);

