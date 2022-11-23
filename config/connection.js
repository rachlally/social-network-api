const { connect, connection } = require('mongoose');

connect('mongodb://localhost/socialnetwork', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
