var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var express = require('express');

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

admin.get('/', function (req, res) {
  res.render('index.html');
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