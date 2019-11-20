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
  "yearMin": lambda record, value : int(record["year"]) >= int(value),
  "yearMax": lambda record, value : int(record["year"]) <= int(value),
}

def recordStr(record):
  return record["title"] + " " + record["year"]

def processRecord(record, query):
  for key, value in query.items():
    value = value.encode('ascii')
    pred = predicates[key]
    if not pred(record, value):
      return []
  return [(recordStr(record), 1)]

runMapper(sys.stdin, getQuery, processRecord)
