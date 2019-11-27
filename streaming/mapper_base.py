keyMap = {
  '0': 'C',
  '1': 'C#',
  '2': 'D',
  '3': 'Eb',
  '4': 'E',
  '5': 'F',
  '6': 'F#',
  '7': 'G',
  '8': 'Ab',
  '9': 'A',
  '10': 'Bb',
  '11': 'B',
}

modeMap = {
  '0': 'minor',
  '1': 'major',
}

def fullKeyStr(key, mode):
  keyStr = keyMap[key]
  modeStr = 'minor' if mode == '0' else 'major'
  return '%s %s' % (keyStr, modeStr)

schema = [
  'song_id',
  'title',
  'release',
  'artist_name',
  'year',
  'duration',
  'tempo',
  'time_signature',
  'loudness',
  'key',
  'mode',
]

separator = '*,*'

def parseLine(line, schema):
  result = {}

  line = line.strip()
  values = line.split(separator)

  for index, key in enumerate(schema):
    result[key] = values[index]
  return result

def stringifyPair(pair):
  return '%s\t%s' % pair

def runMapper(lines, getQuery, processRecord):
  query = getQuery()

  for line in lines:
    record = parseLine(line, schema)
    pairs = processRecord(record, query)
    for pair in pairs:
      print stringifyPair(pair)
