```javascript
const express = require('express');
const router = express.Router();

router.get('/403', (req, res) => {
  res.status(200).json('403'); // or res.render('403') if using a templating engine
});

module.exports = router;
```