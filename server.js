var graphql = require('graphql');
var GraphQLUtilities = require('graphql/utilities');
var graphqlHTTP = require('express-graphql');
var graphqlCustomTypes = require('graphql-custom-types');
var express = require('express');

// sample grad3ph scheme
var grad3ph = {
  nodes: [
    {
      "id": 1,
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
          "type": "datetime"
        },
        {
          "key": "gender",
          "type": "string"
        }
      ]
    },
    {
      id: 2,
      "label": "place",
      "properties": [
        {
          key: "name",
          type: "string"
        },
        {
          key: "id",
          type: "string"
        },
        {
          key: "location",
          type: "string"
        }
      ]
    }
  ],
  edges: [
    {
      "startNodeId": 1,
      "endNodeId": 1,
      "properties": [
        {
          key: 'since',
          type: 'datetime'
        }
      ],
      "label": "friend_with"
    },
    {
      "startNodeId": 1,
      "endNodeId": 2,
      "label": "likes",
      "properties": [
        {
          "key": "liked",
          "type": "datetime"
        }
      ]
    }
  ]
};

/**
 * @param id
 * @returns {Object}
 * @private
 */
function _getNodeSchemeById(id) {
  return grad3ph.nodes.filter(function (node) {
    return node.id === id
  });
}

function _getEdgesByStartNodeId(id) {
  return grad3ph.edges.filter(function (edge) {
    return edge.startNodeId === id;
  });
}

/* ================================================================================================================== */
/* Express */
/* ================================================================================================================== */

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
  int: graphql.GraphQLFloat,
  float: graphql.GraphQLInt,
  datetime: graphqlCustomTypes.GraphQLDateTime,
  email: graphqlCustomTypes.GraphQLEmail,
  url: graphqlCustomTypes.GraphQLURL,
  password: graphqlCustomTypes.GraphQLPassword
};

function createScheme(graphSchemes) {
  var graphQLObjects = {};

  // create GraphQL Edge Object Types
  graphSchemes.edges.forEach(function (edge) {
    graphQLObjects[edge.label] = new graphql.GraphQLObjectType({
      name: edge.label + '_' + _getNodeSchemeById(edge.endNodeId)[0].label,
      description: 'TODO: replace this static description',
      fields: function () {
        return edge.properties.reduce((fields, property) => {
          fields[property.key] = {
            type: TYPES[property.type]
          };
          return fields;
        }, {})
      }
    });
  });

  // create GraphQL Object Types
  graphSchemes.nodes.forEach(function (graphScheme) {
    graphQLObjects[graphScheme.label] = new graphql.GraphQLObjectType({
      name: graphScheme.label,
      description: 'TODO: replace this static description',
      fields: function () {
        return graphScheme.properties.reduce((fields, property) => {
          var edges = _getEdgesByStartNodeId(graphScheme.id);
          edges.forEach(function(edge) {
            fields[edge.label + '_' + _getNodeSchemeById(edge.endNodeId)[0].label] = {
              type: graphQLObjects[edge.label]
            };
          });

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

  graphSchemes.nodes.forEach(function (graphScheme) {
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

  graphSchemes.nodes.forEach(function (graphScheme) {
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
  var scheme = createScheme(grad3ph);
  res.render('index.html', { scheme: GraphQLUtilities.printSchema(scheme) });
});

app
  .use('/', admin)
  .use('/assets', express.static(__dirname + '/public'))
  .use('/graphql', graphqlHTTP({
    schema: createScheme(grad3ph),
    pretty: true,
    graphiql: true
  }))
  .listen(3000);