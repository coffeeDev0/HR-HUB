#!/usr/bin/env bash
set -e

# Attendre la base de données
wait_for_db() {
  if [ -n "$DATABASE_URL" ]; then
    proto="$(echo "$DATABASE_URL" | sed -n 's,^\(.*://\).*,\1,p')"
    url_no_proto="${DATABASE_URL#${proto}}"
    hostport="$(echo "$url_no_proto" | awk -F'@' '{print $2}' | awk -F'/' '{print $1}')"
    host="$(echo "$hostport" | awk -F':' '{print $1}')"
    port="$(echo "$hostport" | awk -F':' '{print $2}')"
  else
    host="${DB_HOST:-postgres-db}"
    port="${DB_PORT:-5432}"
  fi

  host="${host:-postgres-db}"
  port="${port:-5432}"

  echo "⏳ Waiting for database $host:$port ..."
  for i in $(seq 1 40); do
    if command -v nc >/dev/null 2>&1; then
      nc -z "$host" "$port" > /dev/null 2>&1 && { echo "✅ DB reachable"; return 0; }
    else
      if bash -c "cat < /dev/tcp/${host}/${port}" >/dev/null 2>&1; then
        echo "✅ DB reachable"
        return 0
      fi
    fi
    sleep 1
  done

  echo "❌ Timeout waiting for DB $host:$port"
  return 1
}

# Créer les migrations pour les modèles qui n'en ont pas encore
make_migrations() {
  echo "🔨 Creating migrations for changed models..."
  python3 django-authentification-service/manage.py makemigrations --noinput
}

# Appliquer les migrations
run_migrations() {
  echo "🔁 Running migrations..."
  python3 django-authentification-service/manage.py migrate --noinput
}

# Vérifier qu'une table clé existe après les migrations
wait_for_migrations() {
  echo "⏳ Vérification des migrations (table 'authentification_user') ..."
  TRY_MAX=40
  TRY_DELAY=1
  for i in $(seq 1 $TRY_MAX); do
    python3 - <<PYCODE >/dev/null 2>&1 || rc=$?; true
import os
import sys
try:
    import psycopg2
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        raise SystemExit(2)
    conn = psycopg2.connect(DATABASE_URL, connect_timeout=3)
    cur = conn.cursor()
    cur.execute("SELECT to_regclass('public.authentification_user');")
    res = cur.fetchone()
    cur.close()
    conn.close()
    if res and res[0]:
        print("✅ Table trouvée")
        sys.exit(0)
    else:
        sys.exit(1)
except Exception as e:
    sys.exit(1)
PYCODE
    rc=${rc:-0}
    if [ "$rc" -eq 0 ]; then
      echo "✅ Migrations confirmées (table existante)."
      return 0
    fi
    sleep $TRY_DELAY
  done

  echo "❌ Timeout waiting for migrations/table 'authentification_user' to appear"
  return 1
}

# --- Séquence de démarrage ---
wait_for_db
make_migrations
run_migrations
wait_for_migrations

echo "✅ DB et migrations prêts."

# Si c'est un serveur (gunicorn), lancer en arrière-plan + listeners en avant-plan
# Sinon, lancer directement la commande
if [[ "$1" == "gunicorn" ]]; then
  echo "🚀 Démarrage de gunicorn..."
  python3 django-authentification-service/manage.py start_listeners &
  LISTENERS_PID=$!
  
  # Lancer gunicorn au premier plan
  exec "$@"
else
  # Pour les autres commandes (runserver, etc.)
  exec "$@"
fi
