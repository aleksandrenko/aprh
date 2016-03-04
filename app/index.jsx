import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';

require('../node_modules/graphiql/graphiql.css');
require('./css/styles.css');

/**
 * @param graphQLParams
 */
function graphQLFetcher(graphQLParams) {
  return fetch('http://127.0.0.1:3000/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams)
  }).then(response => response.json());
}


export class App extends React.Component {
  render() {
    return (
      <div id='app'>
        <GraphiQL fetcher={graphQLFetcher} />
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.body);