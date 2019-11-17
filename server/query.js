const path = require('path');
const cp = require('child_process');

const hadoopPath = '/hadoop';
const jobDir = path.join(__dirname, '../streaming');

const paths = {
  jar: path.join(hadoopPath, 'share/hadoop/tools/lib/hadoop-streaming-2.10.0.jar'),
  mapper: path.join(jobDir, 'mapper.py'),
  reducer: path.join(jobDir, 'reducer.py'),
  input: '/inputsmall',
  output: '/output',
 }

const commands = {
  job: query => `hadoop jar ${paths.jar} -mapper "python ${paths.mapper} ${query}" -reducer "python ${paths.reducer} ${query}" -input ${paths.input} -output ${paths.output} -file ${paths.reducer} -file ${paths.mapper}`,

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

module.exports.doQuery = query => doClean()
  .then(() => doCommand(commands.job(query)))
  .then(() => doCommand(commands.getOutput()))
