var graphql = require('graphql');
var GraphQLUtilities = require('graphql/utilities');
var graphqlHTTP = require('express-graphql');
var express = require('express');

// sample grad3ph scheme
var grad3ph = {
  "nodes": [
    {
      "label": "user",
      "properties": [
        {
          "key": "name",
          "type": "string"
        },
        {
          "key": "id",
          "type": "id"
        },
        {
          "key": "birthday",
          "type": "date"
        },
        {
          "key": "gender",
          "type": "string"
        },
        {
          key: 'friends',
          type: 'string'
        }
      ]
    }
    //{
    //  "label": "place",
    //  "properties": [
    //    {
    //      key: "name",
    //      type: "string"
    //    },
    //    {
    //      key: "id",
    //      type: "string"
    //    },
    //    {
    //      key: "location",
    //      type: "string"
    //    }
    //  ]
    //}
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
var data = [];

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

console.log('Server online! http://localhost:3000/');

var admin = express(); // the sub app

/* ========================================================================= */

var TYPES = {
  id: graphql.GraphQLID,
  string: graphql.GraphQLString,
  float: graphql.GraphQLFloat,
  int: graphql.GraphQLInt,
  date: graphql.GraphQLString,
  datetime: graphql.GraphQLString
};

function createScheme(graphSchemes) {
  var graphQLObjects = {};

  // create GraphQL Object Types
  graphSchemes.forEach(function (graphScheme) {
    graphQLObjects[graphScheme.label] = new graphql.GraphQLObjectType({
      name: graphScheme.label,
      description: 'TODO: replace this static description',
      fields: function () {
        return graphScheme.properties.reduce((fields, property) => {
          if (property.key === 'friends') {
            fields[property.key] = {
              type: new graphql.GraphQLList(graphQLObjects[graphScheme.label])
            };
            return fields;
          }

          fields[property.key] = {
            type: TYPES[property.type]
          };
          return fields;
        }, {})
      }
    });
  });

  // graph scheme fields
  var graphQlSchemeFields = {};

  graphSchemes.forEach(function (graphScheme) {
    graphQlSchemeFields[graphScheme.label] = {
      type: graphQLObjects[graphScheme.label],
      args: {
        id: { type: graphql.GraphQLString }
      },
      resolve: function (_, args) {
        return data[args.id];
      }
    };
  });

  // mutators
  var graphQLMutators = {};

  graphSchemes.forEach(function (graphScheme) {
    // create mutator
    graphQLMutators['create' + capitalize(graphScheme.label)] = {
      type: graphQLObjects[graphScheme.label],
      args: graphScheme.properties.reduce(function (args, property) {
        // skip id property if there is one
        if (property.key === 'id') {
          return args;
        }

        args[property.key] = {
          type: TYPES[property.type]
        };

        return args;
      }, {})
      ,
      resolve: function (_, args) {
        data.push({
          name: args.name,
          id: data.length
        });
        return data[data.length - 1];
      }
    };
  });

  // The graphQL entry object/scheme
  return new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
      name: 'Query',
      fields: graphQlSchemeFields
    }),
    mutation: new graphql.GraphQLObjectType({
      name: 'Mutators',
      fields: graphQLMutators
    })
  });
}

/* ========================================================================= */


/**
 * GET /
 */
admin.get('/', function (req, res) {
  var scheme = createScheme(grad3ph.nodes);
  res.render('index.html', { scheme: GraphQLUtilities.printSchema(scheme) });
});

app
  .use('/', admin)
  .use('/assets', express.static(__dirname + '/public'))
  .use('/graphql', graphqlHTTP({
    schema: createScheme(grad3ph.nodes),
    pretty: true,
    graphiql: true
  }))
  .listen(3000);