const router = require('express').Router();
const { User, Thought } = require('../../models');

//GET all users
router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => {
            res.json(err)
            console.log(err)
        })
});

//GET user by ID
router.get('/:userId', (req, res) => {
    User.findOne({ _id: req.params.userId })
        .populate({ path: 'thoughts' })
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
})

//POST create user
router.post('/', (req, res) => {
    User.create(req.body)
        .then(user => res.json(user))
        .catch(err => {
            res.json(err)
            console.log(err)
        })
})

//PUT edit user
router.put('/:userId', (req, res) => {
    User.findByIdAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  });

//DELETE user by id
router.delete('/:userId', (req, res) => {
    User.findByIdAndDelete(req.params.userId)
        .then((user) => {
            return !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : Thought.deleteMany({ _id: { $in: user.thoughts }})
})
        .then(() => res.json({ message: "User and associated thoughts deleted!"})) 
        .catch((err) => res.status(500).json(err));
})

//POST add friend
router.post('/:userId/friends', (req, res) => {
    User.findByIdAndUpdate(req.params.userId, {
        $addToSet: { friends: req.body.friendId }
    }, { runValidators: true, new: true })
        .then(user => !user
            ? res.status(404).json({ message: 'No user with that ID, but friend was created' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
})

//DELETE friend
router.delete('/:userId/friends/:friendId', (req, res) => {
    User.findByIdAndUpdate(req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
})

module.exports = router;