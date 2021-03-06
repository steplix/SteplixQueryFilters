'use strict';

const _ = require('lodash');

const defaultOptions = {
    separator: ',',
    separatorGroups: ';',
    key: '[A-Za-z0-9_]+',
    value: '.+',
    operators: ['eq', 'ee', 'ne', 'gt', 'ge', 'lt', 'le', 'li', 'nl', 'in', 'ni', 'be', 'nb', 'is', 'no'],
    operatorPrefix: ' ',
    operatorSuffix: ' ',
    operatorFlags: 'i'
};

const methodParse = 'parse';
const methodFormat = 'format';

const needJsonParse = ['in', 'ni', 'be', 'nb'];

class Parser {
    constructor (options) {
        this.options = _.defaultsDeep({}, options || {}, defaultOptions);
        this.key = this.options.key;
        this.value = this.options.value;
        this.operators = this.options.operators;

        // Compile regexp for parse query
        this.compile();
    }

    static get defaults () {
        return defaultOptions;
    }

    compile () {
        const operators = [];

        // Compile regexp for operators
        _.each(this.operators, operator => operators.push(`${this.options.operatorPrefix}${operator}${this.options.operatorSuffix}`));
        // Instantiate new regexp with key + operators + value
        this.regexpFilters = new RegExp(`^(${this.key})(${operators.join('|')})(${this.value})$`, this.options.operatorFlags);
        this.regexpKey = new RegExp(`^${this.key}$`);
        this.regexpValue = new RegExp(`^${this.value}$`);
        this.regexpOperatorPrefix = new RegExp(`^${this.options.operatorPrefix}`);
        this.regexpOperatorSuffix = new RegExp(`${this.options.operatorSuffix}$`);
    }

    parse (str) {
        // Verify str content
        if (!str || !str.length) {
            return;
        }

        // Reduce str filters
        const filters = _.reduce(str.split(this.options.separator), (carry, filter) => {
            const parsed = this.regexpFilters.exec(filter);

            if (!parsed) {
                return carry;
            }

            const [group, key, operator, value] = parsed; // eslint-disable-line no-unused-vars
            const mappedKey = this.mapKey(key, operator, methodParse);

            carry[mappedKey] = carry[mappedKey] || {};
            carry[mappedKey][this.mapOperator(operator, methodParse)] = this.mapValue(value, operator, methodParse);
            return carry;
        }, {});

        // Verify filters
        if (!_.size(filters)) {
            return;
        }

        return filters;
    }

    format (filters) {
        // Verify filters content
        if (!filters || !_.size(filters)) {
            return;
        }

        let symbols = [];

        // Check if mapper is object
        if (_.isObject(this.options.mapOperator)) {
            // Build symbols set, prevent errors with symbols.
            _.each(this.options.mapOperator, operator => {
                if (_.isSymbol(operator)) {
                    symbols.push(operator);
                }
            });
            // Instantiate symbols set.
            symbols = new Set(symbols);
        }

        // Reduce str filters
        return _.reduce(filters, (carry, content, key) => {
            // Check if is valid key
            if (!this.regexpKey.test(key)) {
                return carry;
            }

            // Prepare content keys, includes symbols keys.
            const keys = Object
                .getOwnPropertySymbols(content)
                .filter(symbol => symbols.has(symbol))
                .concat(_.keys(content));

            // Each all keys.
            _.each(keys, operator => {
                const value = content[operator];

                // Check if is valid value
                if (!this.regexpValue.test(value)) {
                    return;
                }
                return carry.push(`${this.mapKey(key, operator, methodFormat)}${this.options.operatorPrefix}${this.mapOperator(operator, methodFormat)}${this.options.operatorSuffix}${this.mapValue(value, operator, methodFormat)}`);
            });
            return carry;
        }, [])
            .join(this.options.separator);
    }

    mapKey (key, operator, method) {
        let mapper = this.options.mapKey;

        if (!mapper) {
            switch (method) {
                case methodFormat:
                    mapper = this.options.mapKeyFormat;
                    break;

                case methodParse:
                default:
                    mapper = this.options.mapKeyParse;
                    break;
            }
        }

        // Check if key mapper is function
        if (_.isFunction(mapper)) {
            return mapper(key, operator, method);
        }
        // We assume that key mapper is an object
        else if (mapper) {
            return mapper[key] || key;
        }
        return key;
    }

    mapValue (value, operator, method) {
        if (this.options.mapValue) {
            return this.options.mapValue(value, operator, method);
        }

        // We assume that mapper is an object
        switch (method) {
            case methodFormat:
                if (this.options.mapValueFormat) {
                    return this.options.mapValueFormat(value, operator);
                }
                if (_.isArray(value)) {
                    return `(${value.join(',')})`;
                }
                if (_.isObject(value)) {
                    return JSON.stringify(value);
                }
                return value;

            case methodParse:
            default:
                if (needJsonParse.includes(operator.trim().toLowerCase())) {
                    value = _.map(value.trim().replace(/^\[/, '').replace(/\]$/, '').split(this.options.separatorGroups), _.trim);
                }
                if (this.options.mapValueParse) {
                    return this.options.mapValueParse(value, operator);
                }
                return value;
        }

    }

    mapOperator (operator, method) {
        // Clean operator
        if (method === methodParse) {
            operator = operator.trim().toLowerCase().replace(this.regexpOperatorPrefix, '').replace(this.regexpOperatorSuffix, '');
        }

        // Supports backward compatibility
        this.options.mapOperator = this.options.mapOperator || this.options.mapper;

        // Check if has any mapper
        if (!this.options.mapOperator) {
            return operator;
        }

        // Check if mapper is function
        if (_.isFunction(this.options.mapOperator)) {
            return this.options.mapOperator(operator, method);
        }

        // We assume that mapper is an object
        switch (method) {
            case methodFormat:
                if (!this.options.mapOperatorInverse) {
                    this.options.mapOperatorInverse = _.invert(this.options.mapOperator);
                }
                return this.options.mapOperatorInverse[operator] || operator;

            case methodParse:
            default:
                return this.options.mapOperator[operator] || operator;
        }
    }
}

module.exports = Parser;
