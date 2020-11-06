from flask import Flask, render_template, request, Response, send_from_directory
import json
import datetime
import requests
import re

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

@app.route('/assets/images/<path:filename>')
def assets_images_static(filename):
    return send_from_directory(app.root_path + '/assets/images/', filename)

@app.route('/assets/sounds/<path:filename>')
def assets_sounds_static(filename):
    return send_from_directory(app.root_path + '/assets/sounds/', filename)

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
    url = 'https://api.travis-ci.org/repos?repository.active=true&limit=200'
    token = request.args.get('token')
    headers = {'Travis-API-Version': '3', 'User-Agent': 'API Explorer', 'Authorization' : 'token ' + token}
    r = requests.get(url, headers=headers)
    return r.text

@app.route('/extRepos')
def travis_wrapper_ext_repos():
    provider_login = request.args.get('provider_login')
    url = 'https://api.travis-ci.org/owner/'+provider_login+'/repos?repository.active=true&limit=200'
    token = request.args.get('token')
    headers = {'Travis-API-Version': '3', 'User-Agent': 'API Explorer', 'Authorization' : 'token ' + token}
    r = requests.get(url, headers=headers)
    return r.text

@app.route('/repoTree')
def travis_wrapper_repoTree():
    token = request.args.get('token')
    repo_id = request.args.get('repo_id')
    url = 'https://api.travis-ci.org/repo/'+repo_id+'/builds?include=job.state,job.config&limit=12'
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
    url = 'https://api.travis-ci.org/build/'+build_id+'/jobs?include=job.state,job.config'
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
    contents = r.json()['content'].strip()
    contents = re.sub(r"\s+", " ", contents)
    errorIndexes = [m.start() for m in re.finditer(' [Ee]rror ', contents)]
    offset = 150
    rightOffset=-1
    arrError = []
    for i in errorIndexes :
        if i <= rightOffset:
            continue
        rightOffset = i + offset
        leftOffset = i - offset if i >= offset else i
        arrError.append("..." + contents[leftOffset:rightOffset] + "...")
    return {"errores": arrError}

@app.route('/webhook', methods=['POST'])
def respond():
    global global_json_travis_notification
    global_json_travis_notification = json.loads(request.form['payload'])
    print(global_json_travis_notification)
    return Response(status=200)
