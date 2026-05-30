# Stage 1: Build dependencies
FROM python:3.9-slim AS builder

# Prevent Python from writing .pyc files and force stdout/stderr logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy dependency file first to improve Docker layer caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# Stage 2: Production runtime image
FROM python:3.9-slim AS runner

# Runtime environment settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

WORKDIR /app

# Copy installed Python packages and executable scripts from builder image
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application source code and configuration
COPY service/ ./service
COPY wsgi.py .
COPY config.py .

# Create a non-privileged user for container security hardening
RUN useradd --create-home --uid 1001 devops && \
    chown -R devops:devops /app

USER devops

# Expose application port
EXPOSE 8080

# Optional health check if your service has a health endpoint
# Remove this if /health does not exist in your Flask app
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/health')" || exit 1

# Start the Flask Accounts service with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "--log-level", "info", "wsgi:app"]
