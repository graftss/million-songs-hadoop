const path = require('path');
const cp = require('child_process');

const hadoopPath = '/hadoop';
const jobDir = path.join(__dirname, '../streaming');

const paths = {
  jar: path.join(hadoopPath, 'share/hadoop/tools/lib/hadoop-streaming-2.10.0.jar'),
  mapper: path.join(jobDir, 'mapper.py'),
  reducer: path.join(jobDir, 'reducer.py'),
  input: '/input',
  output: '/output',
}

const commands = {
  job: query => `hadoop jar ${paths.jar} -mapper "python ${paths.mapper} ${query}" -reducer "python ${paths.reducer} ${query}" -input ${paths.input} -output ${paths.output} -file ${paths.reducer} -file ${paths.mapper}`,

  clean: () => `hadoop fs -rm -r ${paths.output}`,
};

const test = cp.exec(commands.job('full_key'), function(e, stdout, stderr) {
  if (e) return console.log('error: ', e);
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
});
