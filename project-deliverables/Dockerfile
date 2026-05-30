# Stage 1: Build & Dependencies
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
