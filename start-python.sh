#!/usr/bin/env bash

virtualenv venv --python=python3
source venv/bin/activate || venv/Scripts/activate

python -m pip install -r ./src/back-end/requirements.txt

export FLASK_APP=src/back-end/app.py
export FLASK_ENV=production
export FLASK_DEBUG=0

python -m flask run

deactivate


