const router = require('express').Router();

router.get('/', main);

function main(req,res)
{
    res.send('<h3>private works!</h3>');
}

console.log('data controller start ')
module.exports = router;