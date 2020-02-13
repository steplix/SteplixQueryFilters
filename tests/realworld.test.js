'use strict';

const { Query } = require('steplix-database');
const { Parser, Mappers } = require('../core/steplix');

describe('Real world', () => {
    it('should return object with where option format for Steplix Database', done => {
        const parser = new Parser({
            mapper: Mappers.SQL
        });

        const where = parser.parse('active eq 1,description li %nicolas');
        const result = Query.select('users', { where });

        expect(result).to.be.a('string').equal('SELECT * FROM users WHERE active = \'1\' AND description LIKE \'%nicolas\'');

        done();
    });
});
