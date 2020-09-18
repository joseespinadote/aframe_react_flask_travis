from flask import Flask, render_template, request
import requests

app = Flask(__name__, template_folder='./public', static_url_path='/dist', static_folder='./dist')

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/user')
def travis_wrapper_user():
    url = 'https://api.travis-ci.org/user'
    token = request.args.get('token')
    headers = {'Travis-API-Version': '3', 'User-Agent': 'API Explorer', 'Authorization' : 'token ' + token}
    r = requests.get(url, headers=headers)
    return r.text

@app.route('/repos')
def travis_wrapper_repos():
    url = 'https://api.travis-ci.org/repos'
    token = request.args.get('token')
    headers = {'Travis-API-Version': '3', 'User-Agent': 'API Explorer', 'Authorization' : 'token ' + token}
    r = requests.get(url, headers=headers)
    return r.text

@app.route('/builds')
def travis_wrapper_builds():
    repo_id = request.args.get('repo_id')
    url = 'https://api.travis-ci.org/repo/'+repo_id+'/builds'
    token = request.args.get('token')
    headers = {'Travis-API-Version': '3', 'User-Agent': 'API Explorer', 'Authorization' : 'token ' + token}
    r = requests.get(url, headers=headers)
    return r.text
