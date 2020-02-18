# Steplix Query Filter

Steplix Query Filters is a module for parse filters from string to object.

## Index

* [Download & Install][install].
* [How is it used?][how_is_it_used].
* [Tests][tests].

## Download & Install

### NPM
```bash
$ npm install steplix-query-filters
```

### Source code
```bash
$ git clone https://github.com/steplix/SteplixQueryFilters.git
$ cd SteplixQueryFilters
$ npm install
```

## How is it used?

### Simple usage
```js
const { Parser } = require('steplix-query-filters');
const parser = new Parser();

parser.parse('active eq 1,description li %casa');
// { "active": { "eq": "1" }, "description": { "li": "%casa" } }

parser.parse('active eq 1,description li %casa,description eq depto');
// { "active": { "eq": "1" }, "description": { "li": "%casa", "eq": "depto" } }
```

### Operators
| Name | Example         | Description                                                   |
|:-----|:----------------|:--------------------------------------------------------------|
| eq   | id eq 1         | Check equality. id = 1                                        |
| ne   | name ne nico    | Check inequality. name != 'nico'                              |
| gt   | id gt 1         | Check greater than. id > 1                                    |
| ge   | id ge 10        | Check greater than or equal. id >= 10                         |
| lt   | id lt 1         | Check less than. id < 1                                       |
| le   | id le 10        | Check less than or equal. id <= 10                            |
| li   | name li nico%   | Check matches with nico*. name like nico%                     |
| nl   | name nl nico%   | Check not matches with nico*. name not like nico%             |
| in   | id in [1;2;3]   | Check if included on [1,2,3]. id in (1,2,3)                   |
| ni   | id ni [1;2;3]   | Check if not included on [1,2,3]. id not in (1,2,3)           |
| be   | id be [1;10]    | Check if it is between a and b. id between (1 and 10)         |
| nb   | id nb [1;10]    | Check if it is not between a and b. id not between (1 and 10) |

### Configurations
| Name            | Type               | Default                                                       | Description                                                        |
|:----------------|:-------------------|:--------------------------------------------------------------|:-------------------------------------------------------------------|
| separator       | string             | ","                                                           | Filter separator.                                                  |
| key             | string             | "[A-Za-z0-9_]+"                                               | String with RegExp format for match key on filters.                |
| value           | string             | ".+"                                                          | String with RegExp format for match value on filters.              |
| operators       | array              | ['eq','ne','gt','ge','lt','le','li','nl','in','ni','be','nb'] | Operators known to the parser.                                     |
| operatorPrefix  | string             | " "                                                           | Operator prefix in the string filter.                              |
| operatorSuffix  | string             | " "                                                           | Operator suffix in the string filter.                              |
| operatorFlags   | string             | "i"                                                           | Operator regexp flag.                                              |
| mapper          | object or function | null                                                          | Mapper used to replace operators. <b>deprecated</b>                |
| mapOperator     | object or function | null                                                          | Mapper used to replace operators.                                  |
| mapValue        | function           | null                                                          | Mapper used to replace values.                                     |
| mapValueFormat  | function           | null                                                          | Mapper used to replace values <i>only on <b>format</b> method.</i> |
| mapValueParse   | function           | null                                                          | Mapper used to replace values <i>only on <b>parse</b> method.</i>  |
| mapKey          | function           | null                                                          | Mapper used to replace keys.                                     |
| mapKeyFormat    | function           | null                                                          | Mapper used to replace keys <i>only on <b>format</b> method.</i> |
| mapKeyParse     | function           | null                                                          | Mapper used to replace keys <i>only on <b>parse</b> method.</i>  |
| separatorGroups | string             | ";"                                                           | Filter group separator. Example "id in [1;2;3]"                    |

#### Configuration examples
```js
const parser = new Parser({
  separator: '---'
});

parser.parse('active eq 1---description li %casa');
// { "active": { "eq": "1" }, "description": { "li": "%casa" } }
```

```js
const parser = new Parser({
  operators: Parser.defaults.operators.concat(['my-operator'])
});

parser.parse('active eq 1,description my-operator casa');
// { "active": { "eq": "1" }, "description": { "my-operator": "casa" } }
```

#### Configuration mapper

Inspired to use in combination with **steplix-database**

```js
const { Parser, Mappers } = require('steplix-query-filters');
const parser = new Parser({
  mapper: Mappers.SQL
});

parser.parse('active eq 1,description li %casa');
// { "active": { "=": "1" }, "description": { "LIKE": "%casa" } }
```

Complete example with **steplix-database**
```js
const { Database, Query } = require('steplix-database');
const { Parser, Mappers } = require('steplix-query-filters');
const db = new Database({
  host: 'localhost',
  user: 'myuser',
  password: 'mypass',
  database: 'mydbname'
});
const parser = new Parser({
  mapper: Mappers.SQL
});

const where = parser.parse('active eq 1,description li %nicolas');
const query = Query.select('users', { where });
// "SELECT * FROM users WHERE active = '1' AND description LIKE '%nicolas'"

db.query(query);
// array<user models>
```

### Format
```js
const parser = new Parser();

parser.format({
  active: {
    eq: "1"
  },
  description: {
    li: "%casa"
  }
});
// "active eq 1,description li %casa"
```

## Tests

In order to see more concrete examples, **I INVITE YOU TO LOOK AT THE TESTS :)**

### Run the unit tests
```bash
npm install
npm test
```

<!-- deep links -->
[install]: #download--install
[how_is_it_used]: #how-is-it-used
[tests]: #tests
