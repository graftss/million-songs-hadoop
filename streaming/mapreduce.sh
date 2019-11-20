QUERY="${*:1}"

cat ../hdf5/summary/0.txt | python mapper.py "$QUERY" | sort | python reducer.py
