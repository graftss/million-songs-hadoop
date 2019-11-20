cat ../hdf5/summary/0.txt | python mapper-search.py "./searchjson.txt" | sort | python reducer.py
