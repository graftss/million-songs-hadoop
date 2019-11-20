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
- search_title [fragment]
"""

import sys
import math
from mapper_base import *

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
    fullKey = fullKeyStr(record['key'], record['mode'])
    return [(fullKey, 1)]

def getQuery():
  query = []
  for arg in sys.argv[1:]:
    query += arg.split(' ')
  return query

runMapper(sys.stdin, getQuery, processRecord)
