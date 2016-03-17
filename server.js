var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');

// sample grad3ph scheme
var grad3ph = {
  "nodes": [
    {
      "x": 281,
      "y": 171,
      "color": "#AB274F",
      "label": "name",
      "properties": [
        {
          "id": "ada91298",
          "key": "name",
          "type": "string",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": true
        },
        {
          "id": "afb533af",
          "key": "age",
          "type": "number",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": true
        },
        {
          "id": "a6a772a4",
          "key": "id",
          "type": "number",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": true
        }
      ],
      "id": "a08c199c",
      "isSelected": false,
      "isNode": true
    },
    {
      "x": 320,
      "y": 405,
      "color": "#3B7A57",
      "label": "articles",
      "properties": [
        {
          "id": "ae8b9f87",
          "key": "title",
          "type": "string",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": false
        },
        {
          "id": "a4bcf0be",
          "key": "text",
          "type": "string",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": true
        },
        {
          "id": "ad9465b2",
          "key": "created_on",
          "type": "date",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": true
        }
      ],
      "id": "a880b3b9",
      "isSelected": false,
      "isNode": true
    }
  ],
  "edges": [
    {
      "startNodeId": "a08c199c",
      "endNodeId": "a880b3b9",
      "middlePointOffset": [0, 0],
      "properties": [],
      "label": "authored",
      "id": "aba7fd8f",
      "isSelected": false,
      "isEdge": true
    },
    {
      "startNodeId": "a08c199c",
      "endNodeId": "a08c199c",
      "middlePointOffset": [-50, 50],
      "properties": [
        {
          "id": "afbeb084",
          "key": "since",
          "type": "date",
          "hasDefaultValue": false,
          "defaultValue": "",
          "hasLimit": false,
          "limit": [0, 0],
          "isRequired": false
        }
      ],
      "label": "friends",
      "id": "aba2e296",
      "isSelected": false,
      "isEdge": true
    }
  ]
};

var app = express();
app.set('views', __dirname + '/viewsçç');
app.engine('html', require('ejs').renderFile);

// Import our data set from above
var data = require('./data.json');

// Define our user type, with two string fields; `id` and `name`
var userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString }
  }
});

// Define our schema, with one top level field, named `user`, that
// takes an `id` argument and returns the User with that ID.
var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: userType,
        args: {
          id: { type: graphql.GraphQLString }
        },
        resolve: function (_, args) {
          return data[args.id];
        }
      }
    }
  })
});

console.log('Server online! http://localhost:3000/');

var admin = express(); // the sub app

/**
 * GET /
 */
admin.get('/', function (req, res) {

  var type = {
    string: 'graphql.GraphQLString',
    float: 'graphql.GraphQLFloat',
    int: 'graphql.GraphQLInt',
    date: 'graphql.GraphQLString',
    datetime: 'graphql.GraphQLString'
  };

  function createScheme(graphSchemes) {
    var graphQLObjects = {};

    graphSchemes.forEach(function(graphScheme) {
      graphQLObjects[graphScheme.label + 'Type'] = new graphql.GraphQLObjectType({
        name: graphScheme.label,
        fields: {
          id: { type: graphql.GraphQLString },
          name: { type: graphql.GraphQLString }
        }
      });
    });

    return graphQLObjects;
  }

  var myScheme = createScheme(grad3ph.nodes);
  res.render('index.html', { scheme: myScheme });
});


app
  .use('/', admin)
  .use('/assets', express.static(__dirname + '/public'))
  .use('/graphql', graphqlHTTP({
    schema: schema,
    pretty: true,
    graphiql: true
  }))
  .listen(3000);