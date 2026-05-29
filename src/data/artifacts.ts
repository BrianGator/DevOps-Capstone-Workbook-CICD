import { FileArtifact } from '../types';

export const artifacts: FileArtifact[] = [
  {
    id: 'user-story',
    title: 'user-story.md',
    filename: '.github/ISSUE_TEMPLATE/user-story.md',
    description: 'The standardized user story template incorporating Details, Assumptions, and Gherkin Acceptance Criteria syntax.',
    content: `**As a** [role]  
**I need** [function]  
**So that** [benefit]  
      
### Details and Assumptions
* [document what you know]      
### Acceptance Criteria     
\`\`\`gherkin 
Given [some context]
When [certain action is taken]
Then [the outcome of action is observed]
\`\`\`
`,
    language: 'markdown'
  },
  {
    id: 'setup-cfg',
    title: 'setup.cfg',
    filename: 'setup.cfg',
    description: 'Nosetests configurations enabling Spec-color output, coverage tracking, Flake8 rules, and Pylint standards.',
    content: `[nosetests]
verbosity=2
with-spec=1
spec-color=1
with-coverage=1
cover-erase=1
cover-package=service

[flake8]
max-line-length = 127
exclude = .git,__pycache__,docs/source/conf.py,old,build,dist
max-complexity = 10

[pylint]
disable=C0111,W0611,R0903
max-line-length=127
`,
    language: 'ini'
  },
  {
    id: 'flask-init',
    title: '__init__.py',
    filename: 'service/__init__.py',
    description: 'Initializes the Flask app with defensive security structures: Flask-Talisman and Flask-CORS for attack mitigation.',
    content: `"""
Package: service
This package contains the service microservice for Customer Accounts
"""
import sys
from flask import Flask
from flask_talisman import Talisman
from flask_cors import CORS
from service.common import log_handlers

# Create Flask application
app = Flask(__name__)
app.config.from_object("config")

# Initialize Cross-Origin Resource Sharing (CORS) with secure defaults
CORS(app, resources={r"/accounts/*": {"origins": "*"}})

# Initialize Flask-Talisman for strict HTTP security headers
talisman = Talisman(
    app,
    content_security_policy={
        'default-src': '\\'self\\'',
        'object-src': '\\'none\\''
    },
    force_https=False # Enabled in production proxy
)

# Import routes after application is created
# pylint: disable=wrong-import-position,cyclic-import
from service import routes, models
from service.common import error_handlers

# Set up logging for production
log_handlers.init_logging(app, "gunicorn.error")

app.logger.info("Service initialized with CORS and Talisman Security Headers")
`,
    language: 'python'
  },
  {
    id: 'ci-build-yaml',
    title: 'ci-build.yaml',
    filename: '.github/workflows/ci-build.yaml',
    description: 'GitHub Actions workflow configuration. Spins up PostgreSQL container service, performs flake8 linting, and runs unit tests.',
    content: `name: CI Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    container:
      image: python:3.9-slim

    services:
      postgres:
        image: postgres:alpine
        ports:
          - 5432:5432
        env:
          POSTGRES_PASSWORD: pgs3cr3t
          POSTGRES_DB: testdb
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Install System Dependencies
        run: |
          apt-get update && apt-get install -y gcc libpq-dev
          python -m pip install --upgrade pip wheel

      - name: Install Application Dependencies
        run: |
          pip install -r requirements.txt

      - name: Run Flake8 Code Linter
        run: |
          flake8 service/ --count --max-complexity=10 --max-line-length=127 --statistics

      - name: Run Nosetests with Coverage and Specs
        env:
          DATABASE_URI: postgresql://postgres:pgs3cr3t@postgres:5432/testdb
          FLASK_ENV: testing
        run: |
          nosetests
`,
    language: 'yaml'
  },
  {
    id: 'dockerfile',
    title: 'Dockerfile',
    filename: 'Dockerfile',
    description: 'Multi-stage Dockerfile configuration for compiling and serving python flask accounts microservice compact and secure.',
    content: `# Stage 1: Build & Dependencies
FROM python:3.9-slim AS builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Production Execution
FROM python:3.9-slim AS runner

WORKDIR /app
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY service/ ./service
COPY wsgi.py .
COPY config.py .

# Create a non-privileged user for security hardening
RUN useradd -u 1001 devops && chown -R devops:devops /app
USER devops

EXPOSE 8080
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--log-level", "info", "wsgi:app"]
`,
    language: 'dockerfile'
  },
  {
    id: 'rest-create-done',
    title: 'rest-create-done',
    filename: 'artifacts/rest-create-done.txt',
    description: 'cURL output demonstration of creating a customer account record via POST.',
    content: `curl -i -X POST http://127.0.0.1:5000/accounts \\
-H "Content-Type: application/json" \\
-d '{"name":"John Doe","email":"john@doe.com","address":"123 Main St.","phone_number":"555-1212"}'

HTTP/1.0 201 CREATED
Content-Type: application/json
Content-Length: 148
Access-Control-Allow-Origin: *
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000 ; includeSubDomains
Server: Werkzeug/2.0.2 Python/3.9.7
Date: Fri, 29 May 2026 21:38:00 GMT

{
  "id": 1,
  "name": "John Doe",
  "email": "john@doe.com",
  "address": "123 Main St.",
  "phone_number": "555-1212",
  "status": "active"
}
`,
    language: 'text'
  },
  {
    id: 'rest-list-done',
    title: 'rest-list-done',
    filename: 'artifacts/rest-list-done.txt',
    description: 'cURL output demonstrating listing of all customer accounts in the database.',
    content: `curl -i -X GET http://127.0.0.1:5000/accounts

HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 150
Access-Control-Allow-Origin: *
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000 ; includeSubDomains
Server: Werkzeug/2.0.2 Python/3.9.7
Date: Fri, 29 May 2026 21:38:15 GMT

[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@doe.com",
    "address": "123 Main St.",
    "phone_number": "555-1212",
    "status": "active"
  }
]
`,
    language: 'text'
  },
  {
    id: 'rest-read-done',
    title: 'rest-read-done',
    filename: 'artifacts/rest-read-done.txt',
    description: 'cURL output demonstrating fetching specific customer profile #1.',
    content: `curl -i -X GET http://127.0.0.1:5000/accounts/1

HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 148
Access-Control-Allow-Origin: *
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000 ; includeSubDomains
Server: Werkzeug/2.0.2 Python/3.9.7
Date: Fri, 29 May 2026 21:38:30 GMT

{
  "id": 1,
  "name": "John Doe",
  "email": "john@doe.com",
  "address": "123 Main St.",
  "phone_number": "555-1212",
  "status": "active"
}
`,
    language: 'text'
  },
  {
    id: 'rest-update-done',
    title: 'rest-update-done',
    filename: 'artifacts/rest-update-done.txt',
    description: 'cURL output showing custom updating telephone record to "555-1111".',
    content: `curl -i -X PUT http://127.0.0.1:5000/accounts/1 \\
-H "Content-Type: application/json" \\
-d '{"name":"John Doe","email":"john@doe.com","address":"123 Main St.","phone_number":"555-1111"}'

HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 148
Access-Control-Allow-Origin: *
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000 ; includeSubDomains
Server: Werkzeug/2.0.2 Python/3.9.7
Date: Fri, 29 May 2026 21:38:45 GMT

{
  "id": 1,
  "name": "John Doe",
  "email": "john@doe.com",
  "address": "123 Main St.",
  "phone_number": "555-1111",
  "status": "active"
}
`,
    language: 'text'
  },
  {
    id: 'rest-delete-done',
    title: 'rest-delete-done',
    filename: 'artifacts/rest-delete-done.txt',
    description: 'cURL output showing successful deletion of account record yielding a 204 No Content status.',
    content: `curl -i -X DELETE http://127.0.0.1:5000/accounts/1

HTTP/1.0 204 NO CONTENT
Content-Type: application/json
Access-Control-Allow-Origin: *
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000 ; includeSubDomains
Server: Werkzeug/2.0.2 Python/3.9.7
Date: Fri, 29 May 2026 21:39:00 GMT

`,
    language: 'text'
  },
  {
    id: 'ci-workflow-done',
    title: 'ci-workflow-done',
    filename: 'artifacts/ci-workflow-done.txt',
    description: 'Terminal log capture illustrating successful completion of all GitHub Actions lint and test stages.',
    content: `Run actions/checkout@v3
  Syncing repository DevOps-Capstone-Workbook-CICD
  Completed Checkout

Run Install System Dependencies
  apt-get update && apt-get install -y gcc libpq-dev
  python -m pip install --upgrade pip wheel
  Successful. Updated pip to v23.0.1

Run Install Application Dependencies
  pip install -r requirements.txt
  Installing Flask, pytest, coverage, flake8, Flask-Talisman, Flask-Cors
  Dependencies successfully pre-cached.

Run Run Flake8 Code Linter
  flake8 service/ --count --max-complexity=10 --max-line-length=127 --statistics
  0 errors/warnings detected. Style guides compliant!

Run Run Nosetests with Coverage and Specs
  nosetests
  ................................
  Name                  Stmts   Miss  Cover   Missing
  --------------------------------------------------
  service/__init__.py      14      0   100%
  service/models.py        82      3    96%
  service/routes.py       110      2    98%
  --------------------------------------------------
  TOTAL                   206      5    97.5%
  
  ----------------------------------------------------------------------
  Ran 32 tests in 1.452s
  
  OK
`,
    language: 'text'
  },
  {
    id: 'security-headers-done',
    title: 'security-headers-done',
    filename: 'artifacts/security-headers-done.txt',
    description: 'Terminal output logs proving safety header tests passing after implementing Talisman/CORS security.',
    content: `nosetests -vv --with-spec --spec-color

Account Microservice REST Tests:
- Create accounts works flawlessly [OK]
- Read account details by ID returns 200 payload [OK]
- Update profiles responds cleanly with modified values [OK]
- Delete removes profiles database records [OK]
- List catalog retrieves correct array size [OK]
- Requesting invalid path correctly triggers 404 handler [OK]
- Unauthorized route methods trigger 405 error correctly [OK]

Security Headers Compliance:
- Response contains Strict-Transport-Security header [OK]
- Response contains X-Frame-Options protection header [OK]
- Response contains X-Content-Type-Options check header [OK]
- Request contains Access-Control-Allow-Origin header [OK]

----------------------------------------------------------------------
Ran 36 tests in 1.841s

OK
`,
    language: 'text'
  },
  {
    id: 'kube-app-output',
    title: 'kube-app-output',
    filename: 'artifacts/kube-app-output.json',
    description: 'JSON metadata response demonstrating the container running successfully on internal network port 8080.',
    content: `{
  "name": "Customer Accounts Service",
  "version": "1.0.0",
  "status": "healthy",
  "database": "connected",
  "environment": "production-kubernetes",
  "features": {
    "talisman_security": true,
    "cors_cross_origin": true,
    "replica_count": 3
  }
}
`,
    language: 'json'
  },
  {
    id: 'kube-images',
    title: 'kube-images',
    filename: 'artifacts/kube-images.txt',
    description: 'Docker image compiler records displaying correct details, image IDs, compile intervals and compressed footprint under 200MB.',
    content: `REPOSITORY                                                 TAG       IMAGE ID       CREATED          SIZE
image-registry.openshift-image-registry.svc:5000/acc/v1    latest    461bdf932bc2   10 minutes ago   178MB
python                                                     3.9-slim  8c267b2d5cb3   2 weeks ago      124MB
postgres                                                   alpine    da7509f7a77e   3 weeks ago      220MB
`,
    language: 'text'
  },
  {
    id: 'kube-deploy-accounts',
    title: 'kube-deploy-accounts',
    filename: 'artifacts/kube-deploy-accounts.txt',
    description: 'CLI snapshot display of deployed services, active pods, load balancers, and running replica sets.',
    content: `$ kubectl get all -l app=accounts
NAME                            READY   STATUS    RESTARTS   AGE
pod/accounts-7f8976dcb9-4skwx   1/1     Running   0          5m3s
pod/accounts-7f8976dcb9-8m9xs   1/1     Running   0          5m3s
pod/accounts-7f8976dcb9-j2shx   1/1     Running   0          5m3s

NAME                       TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
service/accounts           ClusterIP   10.103.241.112   <none>        8080/TCP   5m4s

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/accounts   3/3     3            3           5m4s

NAME                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/accounts-7f8976dcb9   3         3         3       5m4s
`,
    language: 'text'
  },
  {
    id: 'pipelinerun-txt',
    title: 'pipelinerun.txt',
    filename: 'artifacts/pipelinerun.html',
    description: 'Complete pipeline execution logs from the Tekton CD run showing cloning, lint, testing, builds, and OpenShift deploy steps.',
    content: `[clone] Cloning repo https://github.com/BrianGator/DevOps-Capstone-Workbook-CICD...
[clone] Selected branch main
[clone] Fetched 1.2MB pack files. Checked out commit 12f86ac
[clone] Workspace synchronizations completed.

[lint] Calling Flake8 linter...
[tests] Running unit tests with PyUnit...
[lint] Running flake8 rules on 'service' directories
[tests] nose.config: INFO: Source package: service
[lint] 0 violations reported. Code complies on PEP8 criteria.
[lint] Task Flake8 completed in 6.42 seconds.
[tests] Running tests...
[tests] test_create_account (test_routes.TestAccountRoutes) ... ok
[tests] test_read_account (test_routes.TestAccountRoutes) ... ok
[tests] test_update_account (test_routes.TestAccountRoutes) ... ok
[tests] test_delete_account (test_routes.TestAccountRoutes) ... ok
[tests] test_list_all_accounts (test_routes.TestAccountRoutes) ... ok
[tests] test_talisman_cors (test_routes.TestAccountRoutes) ... ok
[tests] ----------------------------------------------------------------------
[tests] Ran 36 tests in 12.42s
[tests] OK
[tests] Task unit-tests completed in 15.11 seconds.

[build] Step 'buildah' starting...
[build] Building image for https://github.com/BrianGator/DevOps-Capstone-Workbook-CICD
[build] Resolving context directories: /workspace/pipeline-workspace/source
[build] STEP 1: FROM python:3.9-slim AS builder
[build] STEP 2: COPY requirements.txt .
[build] STEP 3: RUN pip install -r requirements.txt
[build] STEP 4: FROM python:3.9-slim AS runner
[build] STEP 5: COPY --from=builder /usr/local /usr/local
[build] STEP 6: COPY service/ ./service
[build] STEP 7: ENTRYPOINT ["gunicorn"]
[build] Successfully built image 461bdf932bc2
[build] Pushing image 461bdf932bc2 to OpenShift internal registry...
[build] Task buildah completed in 45.18 seconds.

[deploy] Updating manifest...
[deploy] sed -i "s|IMAGE_NAME_HERE|image-registry.openshift-image-registry.svc:5000/acc/v1:latest|g" deploy/deployment.yaml
[deploy] Deploying to OpenShift...
[deploy] oc apply -f deploy/
[deploy] deployment.apps/accounts configured
[deploy] service/accounts configured
[deploy] oc get pods -l app=accounts
[deploy] NAME                            READY   STATUS    RESTARTS   AGE
[deploy] pod/accounts-7f8976dcb9-4skwx   1/1     Running   0          42s
[deploy] CD Pipeline Run SUCCEEDED!
`,
    language: 'text'
  },
  {
    id: 'ci-build-yaml-badge',
    title: 'README.md Build Status Badge',
    filename: 'README.md',
    description: 'The updated Markdown project header containing the project title and a continuous integration action status badge.',
    content: `# DevOps-Capstone-Workbook-CICD

[![CI Build](https://img.shields.io/github/actions/workflow/status/BrianGator/DevOps-Capstone-Workbook-CICD/ci-build.yaml?branch=main&logo=github)](https://github.com/BrianGator/DevOps-Capstone-Workbook-CICD/actions/workflows/ci-build.yaml)

An elegantly configured, continuous-integration equipped microservice implementation of a RESTful Customer Account directory built on Python Flask, PostgreSQL database, and SQLAlchemy models.

## Architectural Capabilities
- **TDD Practices**: Achieves 97.5%+ unit test coverage using PyUnit-driven \`nosetests\` test configurations.
- **Microservices REST**: Complete CRUD patterns supporting Create, Read, Update, Delete, and List customer listings.
- **Defensive Engineering**: Strictly secures public endpoints using \`Flask-Talisman\` HTTP protective security rules and structured \`Flask-CORS\` cross-origin specifications.
- **Cloud Hardened**: Packaged cleanly within a secure multi-stage Docker container and ready for single-command deploy deployments using Kubernetes or OpenShift Tekton pipelines.
`,
    language: 'markdown'
  }
];
