import sys
import re
import math
import json
from mapper_base import *

# allowed keys in search query:
searchKeys = [
  'title',
  'yearMin',
  'yearMax',
]

def getQuery():
  path = sys.argv[1]
  file = open(path, 'r')
  jsonStr = file.read();
  return json.loads(jsonStr)

predicates = {
  "title": lambda record, value : record["title"].find(value) > -1,
  "artist_name": lambda record, value : record["artist_name"].find(value) > -1,
  "year_min": lambda record, value : int(record["year"]) >= int(value),
  "year_max": lambda record, value : record["year"] != '0' and int(record["year"]) <= int(value),
  "release": lambda record, value : record["release"].find(value) > -1,
  "key": lambda record, value : keyMap[record["key"]] == value,
  "mode": lambda record, value : modeMap[record["mode"]] == value,
  "full_key": lambda record, value : fullKeyStr(record["key"], record["mode"]) == value,
  "duration_min": lambda record, value : float(record["duration"]) >= float(value),
  "duration_max": lambda record, value : float(record["duration"]) <= float(value),
}

def formatYear(year):
  return year if year != '0' else 'unknown'

def formatDuration(duration):
  seconds = int(float(duration))
  mins = seconds / 60
  seconds = seconds % 60
  prefix = '0' if seconds < 10 else ''
  return '%s:%s' % (str(mins), prefix + str(seconds))

def stringifyRecord(record):
  return separator.join([
    record["title"],
    record["release"],
    record["artist_name"],
    formatYear(record["year"]),
    formatDuration(record["duration"]),
    fullKeyStr(record["key"], record["mode"]),
  ])

def processRecord(record, query):
  for key, value in query.items():
    value = value.encode('ascii')
    pred = predicates[key]
    if not pred(record, value):
      return []
  return [(stringifyRecord(record), 1)]

runMapper(sys.stdin, getQuery, processRecord)
