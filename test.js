import pify from 'pify';
import test from 'ava';
import gc from '.';

const testWith = ({_fill, _approve, _reject, prefix, idxGroup}) => {
	const save = idx => _approve({
		url: 'https://myg.itho.st' + (idx + idxGroup),
		username: 'myusername',
		password: 'piripicchio'
	});

	test(prefix + ' approve - store username', async t => {
		await _reject('https://myg.itho.st' + (idxGroup + 1));
		await save(1);
		const result = await _fill('https://myg.itho.st' + (idxGroup + 1));
		t.is(result.username, 'myusername');
		await _reject('https://myg.itho.st' + (idxGroup + 1));
	});

	test(prefix + ' approve - store password', async t => {
		await _reject('https://myg.itho.st' + (idxGroup + 2));
		await save(2);
		const result = await _fill('https://myg.itho.st' + (idxGroup + 2));
		t.is(result.password, 'piripicchio');
		await _reject('https://myg.itho.st' + (idxGroup + 2));
	});

	test(prefix + ' reject - credentials are removed', async t => {
		await save(3);
		await _reject('https://myg.itho.st' + (idxGroup + 3));
		const result = await _fill('https://myg.itho.st' + (idxGroup + 3));
		t.is(result, null);
		await _reject('https://myg.itho.st' + (idxGroup + 3));
	});

	test(prefix + ' fill - is defined', t => {
		t.is(typeof _fill, 'function');
	});

	test(prefix + ' fill - return an object', async t => {
		await save(4);
		const result = await _fill('https://myg.itho.st' + (idxGroup + 4));
		t.is(typeof result, 'object');
		await _reject('https://myg.itho.st' + (idxGroup + 4));
	});

	test(prefix + ' fill - with username', async t => {
		await save(5);
		const result = await _fill('https://myg.itho.st' + (idxGroup + 5));
		t.is(result.username, 'myusername');
		await _reject('https://myg.itho.st' + (idxGroup + 5));
	});

	test(prefix + ' fill - with password', async t => {
		await save(6);
		const result = await _fill('https://myg.itho.st' + (idxGroup + 6));
		t.is(result.password, 'piripicchio');
		await _reject('https://myg.itho.st' + (idxGroup + 6));
	});
};

testWith({
	idxGroup: 0,
	prefix: 'sync',
	_fill: args => Promise.resolve(gc.fillSync(args)),
	_approve: args => Promise.resolve(gc.approveSync(args)),
	_reject: args => Promise.resolve(gc.rejectSync(args))
});

testWith({
	idxGroup: 10,
	prefix: 'async using promises',
	_fill: gc.fill,
	_approve: gc.approve,
	_reject: gc.reject
});

testWith({
	idxGroup: 20,
	prefix: 'async using callbacks',
	_fill: pify(gc.fill),
	_approve: pify(gc.approve),
	_reject: pify(gc.reject)
});
