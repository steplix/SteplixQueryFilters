'use strict';

const { Query } = require('steplix-database');
const { Parser, Mappers } = require('../core/steplix');

describe('Real world', () => {
    it('should return object with where option format for Steplix Database', done => {
        const parser = new Parser({
            mapper: Mappers.SQL
        });

        const where = parser.parse('active eq 1,description li %nicolas,id in [1;2;3],created_at nb [1900-01-01;2000-01-01]');
        const result = Query.select('users', { where });

        expect(result).to.be.a('string').equal('SELECT * FROM users WHERE active = \'1\' AND description LIKE \'%nicolas\' AND id IN ("1","2","3") AND created_at NOT BETWEEN \'1900-01-01\' AND \'2000-01-01\'');

        done();
    });
});
