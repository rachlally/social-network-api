const router = require('express').Router();
const { User, Thought } = require('../../models');

router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => {
            res.json(err)
            console.log(err)
        })
});

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

router.post('/', (req, res) => {
    User.create(req.body)
        .then(user => res.json(user))
        .catch(err => {
            res.json(err)
            console.log(err)
        })
})

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

router.delete('/:userId', (req, res) => {
    User.findByIdAndDelete(req.params.userId)
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json({ message: 'user removed' })
        )
        .catch((err) => res.status(500).json(err));
})

router.post('/:userId/friends', (req, res) => {
    User.create(req.body)
        .then(user => {
            User.findByIdAndUpdate(req.body.userId,
                {
                    $addToSet: { friends: friend._id }
                },
                { new: true })
                .then((user) =>
                    !user
                        ? res.status(404).json({ message: 'No user with that ID, but friend was created' })
                        : res.json(user)

                )
                .catch((err) => res.status(500).json(err));
        })
})

module.exports = router;