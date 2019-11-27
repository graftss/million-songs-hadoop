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
  input: hdfsInputPath,
  output: '/output',
};

const hadoopCommand = (mapper, reducer, query) =>
  `hadoop jar ${paths.jar} \
     -mapper "python ${mapper} ${query}" \
     -reducer "python ${reducer} ${query}" \
     -input ${paths.input} -output ${paths.output} \
     -file ${reducer} -file ${mapper}`;

const commands = {
  job: query => hadoopCommand(paths.mapper, paths.reducer, query),
  search: query => hadoopCommand(paths.mapperSearch, paths.reducer, query),
  clean: () => `hadoop fs -rm -r ${paths.output}`,
  getOutput: () => `hadoop fs -cat ${paths.output}/*`
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

module.exports.doQuery = query =>
  doClean()
    .then(() => doCommand(commands.job(query)))
    .then(() => doCommand(commands.getOutput()))

module.exports.doSearch = query =>
  doClean()
    .then(() => {
      console.log('starting query: ', query);
      fs.writeFileSync(paths.searchJSON, JSON.stringify(query));
      return doCommand(commands.search(paths.searchJSON))
    })
    .then(() => doCommand(commands.getOutput()));
