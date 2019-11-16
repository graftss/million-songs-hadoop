const host = 'http://localhost:8088';
const auth = '?user.name=JULES';
// const auth = '';

const fullURI = uri => [host, uri, auth].join('');

const uris = {
  clusterInfo: fullURI('/ws/v1/cluster/info'),
  newApplicationId: fullURI('/ws/v1/cluster/apps/new-application'),
}

const getJSON = async uri =>
  fetch(uri)
    .then(res => res.text())
    .then(JSON.parse);

const post = async (uri, body = {}) =>
  fetch(uri, { method: 'POST', body })
    .then(res => res.text())

post(uris.newApplicationId, )
  .then(d => console.log(d));
