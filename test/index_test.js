import { fill, approve, reject } from '../index';
import { fillSync, approveSync, rejectSync } from '../index';
import thenify from 'thenify';

const testWith = ({ _fill, _approve, _reject }) => () => {
  const save = () => _approve({
    url: 'https://myg.itho.st',
    username: 'myusername',
    password: 'piripicchio'
  });

  describe('approve', () => {
    let result;

    after( async () => {
      await _reject('https://myg.itho.st');
    });

    before( async () => {
      await _reject('https://myg.itho.st');
      await save();
      result = await _fill('https://myg.itho.st');
    });

    it('store username', () => {
      result.username.should.be.equal('myusername');
    });

    it('store password', () => {
      result.password.should.be.equal('piripicchio');
    });
  });


  describe('reject', () => {
    let result;

    before(async () => {
      await save();
      await _reject('https://myg.itho.st');
      result = await _fill('https://myg.itho.st');
    });

    it('credentials are removed', () => {
      should.equal(result, null);
    });
  });

  describe('fill', () => {
    let result;

    before(async () => {
      await save();
      result = await _fill('https://myg.itho.st');
    });

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

describe('git-credential-sync', () => {
  describe('sync', testWith({
    _fill: fillSync,
    _approve: approveSync,
    _reject: rejectSync
  }));

  describe('async using promises', testWith({
    _fill: fill,
    _approve: approve,
    _reject: reject
  }));

  describe('async using callbacks', testWith({
    _fill: thenify(fill),
    _approve: thenify(approve),
    _reject: thenify(reject)
  }));
});

