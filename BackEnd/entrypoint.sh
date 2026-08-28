#!/bin/sh
set -e

# Schema migrations run in a dedicated one-shot service (see docker-compose.prod.yml),
# not here, so scaling the web service can't race migrations.
python manage.py collectstatic --noinput

WORKERS="${GUNICORN_WORKERS:-3}"

exec gunicorn BackEnd.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers "$WORKERS" \
    --timeout "${GUNICORN_TIMEOUT:-60}" \
    --graceful-timeout 30 \
    --max-requests "${GUNICORN_MAX_REQUESTS:-1000}" \
    --max-requests-jitter 100 \
    --worker-tmp-dir /dev/shm \
    --access-logfile - \
    --error-logfile -
