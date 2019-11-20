JSONPATH="./searchjson.txt"

cat ../hdf5/summary/0.txt | python mapper-search.py "$JSONPATH"
