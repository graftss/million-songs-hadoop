const path = require('path');
const express = require('express');
const { doQuery, doSearch } = require('./query');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/query', (req, res) => {
  doQuery(req.body)
    .then(x => {
      console.log('finished query: ', req.body);
      res.send(x);
    })
    .catch(e => {
      console.log('error in query:', req.body);
      console.log(e);
    });
});

app.post('/api/search', (req, res) => {
  console.log('searching')
  doSearch(req.body)
    .then(x => {
      console.log('finished search: ', req.body);
      res.send(x);
    })
    .catch(e => {
      console.log('error in search:', req.body);
      console.log(e);
    });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
