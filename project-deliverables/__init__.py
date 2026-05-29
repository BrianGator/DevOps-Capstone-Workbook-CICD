"""
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
        'default-src': '\'self\'',
        'object-src': '\'none\''
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
