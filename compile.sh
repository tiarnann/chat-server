FLAG="$@"
STUDENTID="14320164"
if [[ $FLAG == "" ]]; then
    echo "A port number is required when running server. Rerun with \n./compile.sh port_number \n./compile.sh default"
    exit 1
elif [[ $FLAG == "default" ]]; then
    echo "Running server with default port"
    npm run build && npm start
    exit 0
fi

npm run build && studentid=$STUDENTID port=$FLAG npm start