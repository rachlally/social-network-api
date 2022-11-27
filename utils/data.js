const reaction = [
{
    reactionBody: "Wow!",
    username: "rach",
},{
    reactionBody: "Crazy!",
    username: "rach",
},{
    reactionBody: "Bonkers!",
    username: "rach",
}
];


const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];



const getRandomReaction = (int) => {
    const results = [];
    for (let i = 0; i < int; i++) {
        results.push(getRandomArrItem(reaction));
    }
    return results;
};


module.exports = { getRandomReaction }