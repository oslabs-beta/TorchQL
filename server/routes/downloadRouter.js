const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.post('/', (req, res) => {
  const { schema } = req.body;
  fs.writeFile(
    path.resolve(__dirname, '../downloads/fakeSchema.js'),
    schema,
    (err) => {
      if (err) throw err;
    }
  );
});

router.get('/getfile', (req, res) => {
  res.download(path.resolve(__dirname, '../downloads/fakeSchema.js'));
});

module.exports = router;
