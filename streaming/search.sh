JSONPATH="./searchjson.txt"

cat ./summary/0.txt | python mapper-search.py "$JSONPATH"
