FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/django-authentification-service:$PYTHONPATH

WORKDIR /app

COPY django-authentification-service/requirements.txt .

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["gunicorn", "--chdir", "/app/django-authentification-service", "config.wsgi:application", "-b", "0.0.0.0:8000", "--workers", "3"]
