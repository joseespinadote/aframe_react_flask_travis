from flask import Flask, render_template, request, Response
import json
import datetime
import requests

app = Flask(__name__, template_folder='./public', static_url_path='/dist', static_folder='./dist')

global_json_travis_notification = None

def event_stream():
    #if global_json_travis_notification :
    global global_json_travis_notification
    yield 'data:{}\n'.format(global_json_travis_notification)
    #global_json_travis_notification = None

@app.route('/stream')
def stream():
    return Response(event_stream(), mimetype="text/event-stream")

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

@app.route('/build')
def travis_wrapper_build():
    build_id = request.args.get('repo_id')
    url = 'https://api.travis-ci.org/build/'+build
    token = request.args.get('token')
    headers = {'Travis-API-Version': '3', 'User-Agent': 'API Explorer', 'Authorization' : 'token ' + token}
    r = requests.get(url, headers=headers)
    return r.text

@app.route('/buildJobs')
def travis_wrapper_build_jobs():
    build_id = request.args.get('build_id')
    url = 'https://api.travis-ci.org/build/'+build_id+'/jobs?include=job.config'
    token = request.args.get('token')
    headers = {'Travis-API-Version': '3', 'User-Agent': 'API Explorer', 'Authorization' : 'token ' + token}
    r = requests.get(url, headers=headers)
    return r.text

@app.route('/job')
def travis_wrapper_job():
    job_id = request.args.get('job_id')
    url = 'https://api.travis-ci.org/job/'+job_id
    token = request.args.get('token')
    headers = {'Travis-API-Version': '3', 'User-Agent': 'API Explorer', 'Authorization' : 'token ' + token}
    r = requests.get(url, headers=headers)
    return r.text

@app.route('/jobLog')
def travis_wrapper_jobLog():
    job_id = request.args.get('job_id')
    url = 'https://api.travis-ci.org/job/'+job_id+'/log'
    token = request.args.get('token')
    headers = {'Travis-API-Version': '3', 'User-Agent': 'API Explorer', 'Authorization' : 'token ' + token}
    r = requests.get(url, headers=headers)
    return r.text

@app.route('/webhook', methods=['POST'])
def respond():
    global global_json_travis_notification
    global_json_travis_notification = json.loads(request.form['payload'])
    print(global_json_travis_notification)
    return Response(status=200)
