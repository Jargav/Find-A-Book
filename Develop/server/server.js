const express = require('express');
//Apollo server
const {ApolloServer} = require('apollo-server-express');
const path = require('path');
//typeDefs-resolvers
const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');
const db = require('./config/connection');
//const routes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express();

//apollo server 
const startServer = async () => {
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

await server.start();
//apply apollo server with express app
server.applyMiddleware({ app });
console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};
startServer()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  console.log("I am here in production");
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//app.use(routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);  
  });
});