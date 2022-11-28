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

// router.put('/:thoughtId', (req, res)=> {
//     Thought.findByIdAndUpdate(req.params.thoughtId,{
//         $addToSet: { thoughts: thought._id }
//     })
//     .then(thought=> {
//         User.
//     })
// })


// Project.findByIdAndUpdate(req.params.projectId, {
//     $addToSet: { yarns: req.body }
// }, { new: true })
//     .then(project => !project
//         ? res.status(404).json({ message: 'No project with that ID, but project was created' })
//         : res.json(project)
//     )
//     .catch((err) => res.status(500).json(err));
// })

router.delete('/:thoughtId', (req, res) => {
    Thought.findByIdAndDelete(req.params.thoughtId)
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json({ message: 'thought removed' })
        )
        .catch((err) => res.status(500).json(err));
})

module.exports = router;