const connection = require('../config/connection');

const { User, Thought } = require('../models')
const { getRandomReaction } = require('./data');

const thoughtData = [
    {
        thoughtText: 'Dirtbikes are fun',
        username: 'lally',
    },
    {
      thoughtText: 'Mountain biking with friends is great',
      username: 'lally',
    },
    {
      thoughtText: 'Cant wait to ski this season',
      username: 'lally',
    },
    {
      thoughtText: 'Running is good for us',
      username: 'lally',
  },
]


connection.on('error', (err) => err);


connection.once('open', async () => {
    console.log('connected');

    // Drop existing users
    await User.deleteMany({});

    await Thought.deleteMany({})

    const thoughts = []

    thoughtData.forEach(thought => {
        const reactions = getRandomReaction(2);
        thought.reactions = reactions;
        thoughts.push(thought)
    })



    await Thought.collection.insertMany(thoughts)

    await User.collection.insertOne({
        username: 'lally',
        email: 'rlally89@gmail.com',
        thoughts: [...thoughts.map(thought => thought._id)]
    })



    // Log out the seed data to indicate what should appear in the database
    console.table(thoughts);
    console.info('Seeding complete! 🌱');
    process.exit(0);
});