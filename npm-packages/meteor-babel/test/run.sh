#!/usr/bin/env bash

# Fail the entire test suite if any runTests command fails:
set -e

cd $(dirname $0)
TEST_DIR=$(pwd)

BABEL_CACHE_DIR=${TEST_DIR}/.cache
export BABEL_CACHE_DIR

runTests() {
    mocha \
        --reporter spec \
        --full-trace \
        --require ../runtime.js \
        --require ${TEST_DIR}/register.js \
        tests.js
}

runTests
echo "Running tests again with modern browser options..."
export COMPILE_FOR_MODERN_BROWSERS=1
runTests
