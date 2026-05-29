# DevOps-Capstone-Workbook-CICD

[![CI Build](https://img.shields.io/github/actions/workflow/status/BrianGator/DevOps-Capstone-Workbook-CICD/ci-build.yaml?branch=main&logo=github)](https://github.com/BrianGator/DevOps-Capstone-Workbook-CICD/actions/workflows/ci-build.yaml)

An elegantly configured, continuous-integration equipped microservice implementation of a RESTful Customer Account directory built on Python Flask, PostgreSQL database, and SQLAlchemy models.

## Architectural Capabilities
- **TDD Practices**: Achieves 97.5%+ unit test coverage using PyUnit-driven `nosetests` test configurations.
- **Microservices REST**: Complete CRUD patterns supporting Create, Read, Update, Delete, and List customer listings.
- **Defensive Engineering**: Strictly secures public endpoints using `Flask-Talisman` HTTP protective security rules and structured `Flask-CORS` cross-origin specifications.
- **Cloud Hardened**: Packaged cleanly within a secure multi-stage Docker container and ready for single-command deploy deployments using Kubernetes or OpenShift Tekton pipelines.
