'use strict';

const { Parser, Mappers } = require('../core/steplix');

describe('Parser', () => {
    describe('#parse', () => {
        it('should return object with key "active" and "description"', done => {
            const parser = new Parser();
            const result = parser.parse('active eq 1,description li %casa');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active').to.have.property('eq').equal('1');
            expect(result).to.have.property('description').to.have.property('li').equal('%casa');

            done();
        });

        it('should return object when option "separator" is modified', done => {
            const parser = new Parser({
                separator: '---'
            });
            const result = parser.parse('active eq 1---description li %casa');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active').to.have.property('eq').equal('1');
            expect(result).to.have.property('description').to.have.property('li').equal('%casa');

            done();
        });

        it('should return object when option "key" is modified', done => {
            const parser = new Parser({
                key: '[A-Za-z_]+'
            });
            const result = parser.parse('active eq 1,description_01 li %casa');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active').to.have.property('eq').equal('1');
            expect(result).to.not.have.property('description_01');

            done();
        });

        it('should return object when option "value" is modified', done => {
            const parser = new Parser({
                value: '\\\d+' // eslint-disable-line no-useless-escape
            });
            const result = parser.parse('active eq 1,description li %casa');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active').to.have.property('eq').equal('1');
            expect(result).to.not.have.property('description_01');

            done();
        });

        it('should return object when option "operators" is modified', done => {
            const parser = new Parser({
                operators: Parser.defaults.operators.concat(['my-operator'])
            });
            const result = parser.parse('active eq 1,description my-operator %casa');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active').to.have.property('eq').equal('1');
            expect(result).to.have.property('description').to.have.property('my-operator').equal('%casa');

            done();
        });

        it('should return object when option "operatorPrefix" is modified', done => {
            const parser = new Parser({
                operatorPrefix: '-'
            });
            const result = parser.parse('active-eq 1,description-li %casa');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active').to.have.property('eq').equal('1');
            expect(result).to.have.property('description').to.have.property('li').equal('%casa');

            done();
        });

        it('should return object when option "operatorSuffix" is modified', done => {
            const parser = new Parser({
                operatorSuffix: '-'
            });
            const result = parser.parse('active eq-1,description li-%casa');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active').to.have.property('eq').equal('1');
            expect(result).to.have.property('description').to.have.property('li').equal('%casa');

            done();
        });

        it('should return object when option "mapper" is modified', done => {
            const parser = new Parser({
                mapper: Mappers.SQL
            });
            const result = parser.parse('active eq 1,description li %casa');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active').to.have.property('=').equal('1');
            expect(result).to.have.property('description').to.have.property('LIKE').equal('%casa');

            done();
        });

        it('should return undefined when not has any filter', done => {
            const parser = new Parser();
            const result = parser.parse('active-not-working eq 1,description-not-working li %casa');

            expect(result).to.be.a('undefined');

            done();
        });
    });

    describe('#format', () => {
        it('should return string with key "active" and "description"', done => {
            const parser = new Parser();
            const result = parser.format({ active: { eq: 1 }, description: { li: '%casa' } });

            expect(result).to.be.a('string').equal('active eq 1,description li %casa');

            done();
        });

        it('should return string when option "separator" is modified', done => {
            const parser = new Parser({
                separator: '---'
            });
            const result = parser.format({ active: { eq: 1 }, description: { li: '%casa' } });

            expect(result).to.be.a('string').equal('active eq 1---description li %casa');

            done();
        });

        it('should return string when option "key" is modified', done => {
            const parser = new Parser({
                key: '[A-Za-z_]+'
            });
            const result = parser.format({ active: { eq: 1 }, description_01: { li: '%casa' } });

            expect(result).to.be.a('string').equal('active eq 1');

            done();
        });

        it('should return string when option "value" is modified', done => {
            const parser = new Parser({
                value: '\\\d+' // eslint-disable-line no-useless-escape
            });
            const result = parser.format({ active: { eq: 1 }, description: { li: '%casa' } });

            expect(result).to.be.a('string').equal('active eq 1');

            done();
        });

        it('should return string when option "operators" is modified', done => {
            const parser = new Parser({
                operators: Parser.defaults.operators.concat(['my-operator'])
            });
            const result = parser.format({ active: { eq: 1 }, description: { 'my-operator': '%casa' } });

            expect(result).to.be.a('string').equal('active eq 1,description my-operator %casa');

            done();
        });

        it('should return string when option "operatorPrefix" is modified', done => {
            const parser = new Parser({
                operatorPrefix: '-'
            });
            const result = parser.format({ active: { eq: 1 }, description: { li: '%casa' } });

            expect(result).to.be.a('string').equal('active-eq 1,description-li %casa');

            done();
        });

        it('should return string when option "operatorSuffix" is modified', done => {
            const parser = new Parser({
                operatorSuffix: '-'
            });
            const result = parser.format({ active: { eq: 1 }, description: { li: '%casa' } });

            expect(result).to.be.a('string').equal('active eq-1,description li-%casa');

            done();
        });

        it('should return string when option "mapper" is modified', done => {
            const parser = new Parser({
                mapper: Mappers.SQL
            });
            const result = parser.format({ active: { '=': 1 }, description: { LIKE: '%casa' } });

            expect(result).to.be.a('string').equal('active eq 1,description li %casa');

            done();
        });
    });
});
