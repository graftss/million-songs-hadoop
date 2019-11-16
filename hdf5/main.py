import os
import functools
from getters import *

summaryFilePath = "msd_summary_file.h5"
separator = '*,*'

k = 300 # 1000 for full dataset
split = True

if split:
  files = k
  perFile = k
else:
  files = 1
  perFile = k * k

def songDataString(file, separator, index):
  strList = []
  strList.append(get_song_id(file, index))
  strList.append(separator)
  strList.append(get_title(file, index))
  strList.append(separator)
  strList.append(get_release(file, index))
  strList.append(separator)
  strList.append(get_artist_name(file, index))
  strList.append(separator)
  strList.append(str(get_year(file, index)))
  strList.append(separator)
  strList.append(str(get_duration(file, index)))
  strList.append(separator)
  strList.append(str(get_tempo(file, index)))
  strList.append(separator)
  strList.append(str(get_time_signature(file, index)))
  strList.append(separator)
  strList.append(str(get_loudness(file, index)))
  strList.append(separator)
  strList.append(str(get_key(file, index)))
  strList.append(separator)
  strList.append(str(get_mode(file, index)))
  return ''.join(strList)

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
