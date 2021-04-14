'use strict';

const { Parser, Mappers } = require('../core/steplix');

describe('Parser', () => {
    describe('#parse', () => {
        it('should return object with key "active", "description" and "deleted_at"', done => {
            const parser = new Parser();
            const result = parser.parse('active eq 1,description li %casa,deleted_at is null');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active').to.have.property('eq').equal('1');
            expect(result).to.have.property('description').to.have.property('li').equal('%casa');
            expect(result).to.have.property('deleted_at').to.have.property('is').equal('null');

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

        it('should return object when option "mapKey" is modified', done => {
            const parser = new Parser({
                mapKey: key => `${key}_modified`
            });
            const result = parser.parse('active eq 1,description li %casa');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active_modified').to.have.property('eq').equal('1');
            expect(result).to.have.property('description_modified').to.have.property('li').equal('%casa');

            done();
        });

        it('should return object when option "mapKeyParse" is modified', done => {
            const parser = new Parser({
                mapKeyParse: key => `${key}_modified`
            });
            const result = parser.parse('active eq 1,description li %casa');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active_modified').to.have.property('eq').equal('1');
            expect(result).to.have.property('description_modified').to.have.property('li').equal('%casa');

            done();
        });

        it('should return object when option "mapValue" is modified', done => {
            const parser = new Parser({
                mapValue: value => `${value}_modified`
            });
            const result = parser.parse('active eq 1,description li %casa');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active').to.have.property('eq').equal('1_modified');
            expect(result).to.have.property('description').to.have.property('li').equal('%casa_modified');

            done();
        });

        it('should return object when option "mapValueParse" is modified', done => {
            const parser = new Parser({
                mapValueParse: value => `${value}_modified`
            });
            const result = parser.parse('active eq 1,description li %casa');

            expect(result).to.be.a('object');
            expect(result).to.have.property('active').to.have.property('eq').equal('1_modified');
            expect(result).to.have.property('description').to.have.property('li').equal('%casa_modified');

            done();
        });

        it('should return object when option "mapOperator" is modified', done => {
            const parser = new Parser({
                mapOperator: Mappers.SQL
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

        it('should return object with key "model" as array', done => {
            const parser = new Parser();
            const result = parser.parse('model in [model1;model2]');

            expect(result).to.be.a('object');
            expect(result).to.have.property('model').to.have.property('in').members(['model1', 'model2']);

            done();
        });


        it('should return jsonParsed when you set needJsonParse filter', done => {
            const parser = new Parser({
                operators: ["between"],
                needJsonParse: ["between"]
            });
            const result = parser.parse('count between [1;100]');
   
            expect(result).to.be.a('object');
            expect(result).to.have.property('count').to.have.property('between').members(["1", "100"])

            done();
        });
    });

    describe('#format', () => {
        it('should return string with key "active", "description" and "deleted_at"', done => {
            const parser = new Parser();
            const result = parser.format({ active: { eq: 1 }, description: { li: '%casa' }, deleted_at: { is: 'null' } });

            expect(result).to.be.a('string').equal('active eq 1,description li %casa,deleted_at is null');

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

        it('should return string when option "mapKey" is modified', done => {
            const parser = new Parser({
                mapKey: key => `${key}_modified`
            });
            const result = parser.format({ active: { eq: 1 }, description: { li: '%casa' } });

            expect(result).to.be.a('string').equal('active_modified eq 1,description_modified li %casa');

            done();
        });

        it('should return string when option "mapKeyFormat" is modified', done => {
            const parser = new Parser({
                mapKeyFormat: key => `${key}_modified`
            });
            const result = parser.format({ active: { eq: 1 }, description: { li: '%casa' } });

            expect(result).to.be.a('string').equal('active_modified eq 1,description_modified li %casa');

            done();
        });

        it('should return string when option "mapValue" is modified', done => {
            const parser = new Parser({
                mapValue: value => `${value}_modified`
            });
            const result = parser.format({ active: { eq: 1 }, description: { li: '%casa' } });

            expect(result).to.be.a('string').equal('active eq 1_modified,description li %casa_modified');

            done();
        });

        it('should return string when option "mapValueFormat" is modified', done => {
            const parser = new Parser({
                mapValueFormat: value => `${value}_modified`
            });
            const result = parser.format({ active: { eq: 1 }, description: { li: '%casa' } });

            expect(result).to.be.a('string').equal('active eq 1_modified,description li %casa_modified');

            done();
        });

        it('should return string when option "mapOperator" is modified', done => {
            const parser = new Parser({
                mapOperator: Mappers.SQL
            });
            const result = parser.format({ active: { '=': 1 }, description: { LIKE: '%casa' } });

            expect(result).to.be.a('string').equal('active ee 1,description li %casa');

            done();
        });
    });
});
