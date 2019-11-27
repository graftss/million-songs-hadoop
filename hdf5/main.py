import os
import functools
from getters import *

summaryFilePath = "msd_summary_file.h5"
separator = '*,*'

k = 1 # 1000 for full dataset
split = True

if split:
  files = k
  perFile = k
else:
  files = 1
  perFile = k * k

def songDataString(file, separator, index):
  fields = [
    get_song_id(file, index),
    get_title(file, index),
    get_release(file, index),
    get_artist_name(file, index),
    str(get_year(file, index)),
    str(get_duration(file, index)),
    str(get_tempo(file, index)),
    str(get_time_signature(file, index)),
    str(get_loudness(file, index)),
    str(get_key(file, index)),
    str(get_mode(file, index)),
  ]

  return separator.join(fields)

def summaryOutPath(index):
  return os.path.join("summary", str(index) + ".txt")

def processSummary():
  file = open_h5_file_read(summaryFilePath)
  for i in range(0, files):
    out = summaryOutPath(i)
    with open(out, 'a') as f:
      for j in range(0, perFile):
        f.write(songDataString(file, separator, i * k + j))
        f.write('\n')
  file.close()

processSummary()
