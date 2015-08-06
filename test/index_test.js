import gsw from '../index';

describe('git-switch', () => {
  it('is defined', () => {
    gsw.should.be.a('function');
  });

  it('support async', async () => {
    const result = await Promise.resolve(gsw());
    console.dir(result)
    result.should.be.equal(42);
  });
});
