'use strict';

const gc = require('../es6');
const co = require('co');
const thenify = require('thenify');
global.should = require('chai').should();

const testWith = args => () => {
  const _fill = args._fill;
  const _approve = args._approve;
  const _reject = args._reject;

  const save = () => _approve({
    url: 'https://myg.itho.st',
    username: 'myusername',
    password: 'piripicchio'
  });

  describe('approve', () => {
    let result;

    after(  () =>
      _reject('https://myg.itho.st')
    );

    before( co.wrap(function * () {
      yield _reject('https://myg.itho.st');
      yield save();
      result = yield _fill('https://myg.itho.st');
    }));

    it('store username', () => {
      result.username.should.be.equal('myusername');
    });

    it('store password', () => {
      result.password.should.be.equal('piripicchio');
    });
  });


  describe('reject', () => {
    let result;

    before(co.wrap(function * () {
      yield save();
      yield _reject('https://myg.itho.st');
      result = yield _fill('https://myg.itho.st');
    }));

    it('credentials are removed', () => {
      should.equal(result, null);
    });
  });

  describe('fill', () => {
    let result;

    before(co.wrap(function * () {
      yield save();
      result = yield _fill('https://myg.itho.st');
    }));

    it('is defined', () => {
      _fill.should.be.a('function');
    });

    it('return an object', () => {
      result.should.be.a('object');
    });

    it('with username', () => {
      result.username.should.be.equal('myusername');
    });

    it('with password', () => {
      result.password.should.be.equal('piripicchio');
    });
  });
};

describe('git-credential-node', () => {
  describe('sync', testWith({
    _fill: args => Promise.resolve(gc.fillSync(args)),
    _approve: args => Promise.resolve(gc.approveSync(args)),
    _reject: args => Promise.resolve(gc.rejectSync(args))
  }));

  describe('async using promises', testWith({
    _fill: gc.fill,
    _approve: gc.approve,
    _reject: gc.reject
  }));

  describe('async using callbacks', testWith({
    _fill: thenify(gc.fill),
    _approve: thenify(gc.approve),
    _reject: thenify(gc.reject)
  }));
});

