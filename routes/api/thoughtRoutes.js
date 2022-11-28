const router = require('express').Router();
const { Thought, User } = require('../../models');

router.get('/', (req, res) => {
    Thought.find()
        .then(users => res.json(users))
        .catch(err => {
            res.json(err)
            console.log(err)
        })
})

router.get('/:thoughtId', (req, res) => {
    Thought.findOne({ _id: req.params.thoughtId })
        .populate({ path: 'reactions' })
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
})

router.post('/', (req, res) => {
    Thought.create(req.body)
        .then(thought => {
            User.findByIdAndUpdate(req.body.userId,
                {
                    $addToSet: { thoughts: thought._id }
                },
                { new: true })
                .then((user) =>
                    !user
                        ? res.status(404).json({ message: 'No user with that ID, but thought was created' })
                        : res.json(thought)

                )
                .catch((err) => res.status(500).json(err));
        })
})

router.put('/:thoughtId', (req, res) => {
    Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with this id!' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
});

router.delete('/:thoughtId/:userId', (req, res) => {
    Thought.findByIdAndDelete(req.params.thoughtId)
        .then(thought => {
            !thought ? res.status(404).json({ message: 'No thought with that ID' }) : User.findByIdAndUpdate(req.params.userId, {
                $pull: { thoughts: req.params.thoughtId }
            }, { new: true })
                .then(user => !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user))
        })
})

router.post('/:thoughtId/reactions', (req, res) => {
    Thought.findByIdAndUpdate(req.params.thoughtId, {
        $addToSet: { reactions: req.body }
    }, { new: true })
        .then(thought => !thought
            ? res.status(404).json({ message: 'No thought with that ID, but reaction was created' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
})

router.delete('/:thoughtId/reactions/:reactionId', (req, res) => {
    reactions.findByIdAndDelete(req.params.reactionId)
    .then(reaction => {
        !reaction ? res.status(404).json({ message: 'No reaction with that ID' }) : Thought.findByIdAndUpdate(req.params.thoughtId, {
            $pull: { reactions: req.params.reactionId }
        }, { new: true })
            .then(thought => !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json(thought))
    })
})

module.exports = router;