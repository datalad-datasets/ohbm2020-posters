#!/bin/bash

set -x

function process {
    [ -f $1.jpg ] && return
    convert -thumbnail x400 -background white $1[0] $1.jpg
}

for path in $(find ../posters -name "*.pdf"); do
    process $path
done
