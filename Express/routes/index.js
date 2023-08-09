/* const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello')
})

module.exports = router; */



///////////////////////////



/* 
const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    next('route')
}, (req, res, next) => {
    console.log('no exec1')
    next()
}, (req, res, next) => {
    console.log('no exec2')
    next()
})

router.get('/', (req, res) => {
    console.log('exec')
    res.send('Hello')
})

module.exports = router;
 */


///////////////////////





/* const express = require('express')
const router = express.Router()

router.get('/abc', (req, res) => {
    res.send('GET /abc  is done')
})

router.post('/abc', (req, res) => {
    res.send('POST /abc  is done')
})

module.exports = router; */

// 


////////////////////////

/* const express = require('express')
const router = express.Router()

router.route('/abc')
    .get((req, res) => {
    res.send('GET /abc  is done')
})
    .post((req, res) => {
    res.send('POST /abc  is done')
})

module.exports = router;  */



