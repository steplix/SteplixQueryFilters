# Steplix Query Filter

Steplix Query Filter is a module for parsing filters in string to object.

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

### Configure

| Name           | Type            | Default                                                            | Description                                           |
|:---------------|:----------------|:---------------------------------------------------------|:------------------------------------------------------|
| separator      | string          | ","                                                      | Filter separator.                                     |
| key            | string          | "[A-Za-z0-9_]+"                                          | String with RegExp format for match key on filters.   |
| value          | string          | ".+"                                                     | String with RegExp format for match value on filters. |
| operators      | array           | ['eq','ne','gt','ge','lt','le','li','nl','in','ni','be'] | Operators known to the parser.                        |
| operatorPrefix | string          | " "                                                      | Operator prefix in the string filter.                 |
| operatorSuffix | string          | " "                                                      | Operator suffix in the string filter.                 |
| operatorFlags  | string          | "i"                                                      | Operator regexp flag.                                 |
| mapper         | object|function | null                                                     | Mapper used to replace operators.                     |

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
