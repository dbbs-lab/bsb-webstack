from flask import Flask, request
from flask_cors import CORS
from bsb.config import Configuration
from bsb_json import schema

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    from bsb import __version__ as bsb_version
    return {"bsb": {"version": bsb_version}}

@app.route("/schema", methods=["POST"])
def schema_of():
    if len(request.data):
        config = Configuration(request.json)
    else:
        config = Configuration.default()
    return schema(config)
 
@app.route("/default-config")
def default_config():
    return Configuration.default().__tree__()

@app.route("/categories", methods=["POST"])
def categories_of():
    return schema(Configuration(request.json))

