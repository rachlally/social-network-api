const { connect, connection } = require('mongoose');

connect('mongodb://localhost/socialnetworkdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
