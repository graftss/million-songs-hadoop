const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const onWindows = process.env.OS.includes('indows');

let hadoopPath;
let hdfsInputPath;

if (!onWindows) {
  hadoopPath = '~/Desktop/hadoop-2.10.0';
  hdfsInputPath = '/input';
} else {
  hadoopPath = 'c:/hadoop';
  hdfsInputPath = '/inputsmall';
}

const jobDir = path.join(__dirname, '../streaming');
const paths = {
  jar: path.join(hadoopPath, 'share/hadoop/tools/lib/hadoop-streaming-2.10.0.jar'),
  mapper: path.join(jobDir, 'mapper.py'),
  mapperSearch: path.join(jobDir, 'mapper-search.py'),
  searchJSON: path.join(jobDir, 'searchjson.txt'),
  reducer: path.join(jobDir, 'reducer.py'),
  results: path.join(jobDir, 'results.txt'),
  input: hdfsInputPath,
  output: '/output',
};

const defaultParams = {
  reducers: 2,
};

const hadoopCommand = (mapper, reducer, query, params = defaultParams) =>
  `hadoop jar ${paths.jar} \
    -D mapreduce.job.reduces=${params.reducers || defaultParams.reducers} \
    -mapper "python ${mapper} ${query}" \
    -reducer "python ${reducer} ${query}" \
    -input ${paths.input} -output ${paths.output} \
    -file ${reducer} -file ${mapper}`;

const commands = {
  job: query => hadoopCommand(paths.mapper, paths.reducer, query),
  search: (query, params) => hadoopCommand(paths.mapperSearch, paths.reducer, query, params),
  clean: () => `hadoop fs -rm -r ${paths.output}`,
  cacheOutput: () => `hadoop fs -cat ${paths.output}/* > ${paths.results}`,
};

const doCommand = command => new Promise((resolve, reject) => {
  console.log(`start command: ${command}`);
  cp.exec(command, (err, stdout, stderr) => {
    console.log(`finish command: ${command}`);
    if (err) return reject(stderr);
    return resolve(stdout);
  });
});

const doClean = () => doCommand(commands.clean())
  // ignore error resulting from the directory not existing
  .catch((stderr) => {
    if (!stderr.includes('No such file or directory')) {
      throw new Error(stderr);
    }
  });

const getSliceIndices = params => {
  let { max_results, results_page } = params;
  max_results = parseInt(max_results);
  results_page = parseInt(results_page);

  const min = max_results * (results_page - 1);
  return [min, min + max_results];
}

module.exports.doQuery = query =>
  doClean()
    .then(() => doCommand(commands.job(query)))
    .then(() => doCommand(commands.getOutput()))

const compareQueries = (first, second) => {
  for (const field in first) {
    if (first[field] !== second[field]) return false;
  }
  if (Object.keys(first).length !== Object.keys(second).length) {
    return false;
  }
  return true;
};

const getResultSlice = (params, cached) => {
  const allResults = fs.readFileSync(paths.results).toString()
    .split('\n');
  const [minIndex, maxIndex] = getSliceIndices(params);

  const searchSummary = {
    maxResults: allResults.length,
    minIndex,
    maxIndex,
    cached,
  };

  return {
    results: allResults.slice(minIndex, maxIndex).join('\n'),
    searchSummary,
  };
};

const isRepeatedQuery = (query) => {
  const lastQuery = JSON.parse(fs.readFileSync(paths.searchJSON));
  console.log('last query: ', lastQuery);
  return compareQueries(query, lastQuery);
};

module.exports.doSearch = (query, params) => {
  if (isRepeatedQuery(query)) {
    console.log('repeated query, using cached results:', query);
    return Promise.resolve(getResultSlice(params, true));
  }

  return doClean()
    .then(() => {
      console.log('starting query: ', query);
      console.log('params: ', params);
      fs.writeFileSync(paths.searchJSON, JSON.stringify(query));
      return doCommand(commands.search(paths.searchJSON, params))
    })
    .then(() => doCommand(commands.cacheOutput()))
    .then(() => getResultSlice(params, false));
};
