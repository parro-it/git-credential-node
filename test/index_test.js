'use strict';

import git-switch from '..';

describe('git-switch', () => {

    it('is defined', () => {
        git-switch.should.be.a('function');
    });

    it('support async', function *() {
        const result = yield Promise.resolve(git-switch());
        result.should.be.equal(42);
    });

});
