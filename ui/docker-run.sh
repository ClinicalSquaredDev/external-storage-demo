
#!/usr/bin/env bash
set -e
set -x

echo 'Starting external-storage-demo-ui...'

serve --single build
echo 'Done!'

tail -f /dev/null