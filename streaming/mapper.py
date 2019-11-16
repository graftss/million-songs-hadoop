"""
allowed queries:

- time_signature

- year [coarseness=1]
- duration [coarseness=1]
- tempo [coarseness=1]
- loudness [coarseness=1]

- key
- mode
- full_key


"""

import sys
import re
import math

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

def roundStrings(valueStr, coarsenessStr = '1'):
  result = int(float(valueStr))
  coarseness = int(coarsenessStr)
  return result - (result % coarseness)

def processRecord(record, query):
  key = query[0]

  if key == 'duration' or key == 'loudness' or key == 'tempo' or key == 'year':
    return [(roundStrings(record[key], query[1]), 1)]
  elif key == 'time_signature' or key == 'key' or key == 'mode':
    return [(record[key], 1)]
  elif key == 'full_key':
    return [(fullKeyStr(record['key'], record['mode']), 1)]

def stringifyPair(pair):
  return '%s\t%s' % pair

def getQuery():
  query = []
  for arg in sys.argv[1:]:
    query += arg.split(' ')
  return query

def main():
  query = getQuery()

  for line in sys.stdin:
    record = parseLine(line, schema)
    pairs = processRecord(record, query)
    for pair in pairs:
      print stringifyPair(pair)

main()
