import os, requests, socket, schedule, time, threading

EUREKA_SERVER = os.getenv("EUREKA_SERVER", "http://bank-registry-service:8761/eureka")
SERVICE_NAME = os.getenv("SERVICE_NAME", "AUTH-SERVICE")
PORT = int(os.getenv("PORT", 8000))


def _host_and_ip():
    # 1) Préférence pour SERVICE_HOST si défini et utile
    svc_host = os.getenv("SERVICE_HOST")
    if svc_host and svc_host not in (
        "0.0.0.0",
        "127.0.0.1",
        "localhost",
        "bank-registry-service",
    ):
        try:
            ip = socket.gethostbyname(svc_host)
            return svc_host, ip
        except Exception:
            pass

    # 2) Méthode robuste : découvrir l'IP locale utilisée pour sortir vers Internet
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        try:
            hostname = socket.gethostbyaddr(ip)[0]
        except Exception:
            hostname = ip
        return hostname, ip
    except Exception:
        hostname = socket.gethostname()
        try:
            ip = socket.gethostbyname(hostname)
        except Exception:
            ip = "127.0.0.1"
        return hostname, ip


def _try_deregister(instance_id):
    try:
        r = requests.delete(
            f"{EUREKA_SERVER}/apps/{SERVICE_NAME.upper()}/{instance_id}", timeout=5
        )
        if r.status_code in (200, 202, 204):
            print(f"🗑️ Ancienne instance supprimée : {instance_id} ({r.status_code})")
        else:
            # 404 signifie qu'il n'y avait rien à supprimer — c'est OK
            print(f"ℹ️ Tentative suppression {instance_id} => {r.status_code}")
    except Exception as e:
        print(f"⚠️ Erreur lors de la suppression de {instance_id}: {e}")


def register_to_eureka():
    hostname, ip = _host_and_ip()
    # choisir l'instanceId basé sur l'IP (unique et stable sur le réseau)
    instance_id = f"{ip}:{SERVICE_NAME}:{PORT}"
    # ancienne possible instance basée sur le hostname (duplicate)
    old_instance_id = f"{hostname}:{SERVICE_NAME}:{PORT}"

    # tenter de supprimer l'ancienne inscription si différente
    if old_instance_id != instance_id:
        _try_deregister(old_instance_id)

    payload = {
        "instance": {
            "instanceId": instance_id,
            "hostName": hostname,
            "app": SERVICE_NAME.lower(),
            "ipAddr": ip,
            "vipAddress": SERVICE_NAME.lower(),
            "status": "UP",
            "overriddenstatus": "UNKNOWN",
            "port": {"$": PORT, "@enabled": "true"},
            "homePageUrl": f"http://{ip}:{PORT}/",
            "statusPageUrl": f"http://{ip}:{PORT}/status",
            "healthCheckUrl": f"http://{ip}:{PORT}/health",
            "dataCenterInfo": {
                "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
                "name": "MyOwn",
            },
        }
    }

    try:
        r = requests.post(
            f"{EUREKA_SERVER}/apps/{SERVICE_NAME.upper()}", json=payload, timeout=5
        )
        print(f"✅ Enregistré sur Eureka: {r.status_code} - instanceId={instance_id}")
        if r.status_code not in (200, 204):
            print(f"⚠️ Réponse Eureka inattendue: {r.status_code} {r.text}")
    except Exception as e:
        print(f"⚠️ Erreur d’enregistrement Eureka: {e}")

    return instance_id


def send_heartbeat(instance_id):
    try:
        r = requests.put(
            f"{EUREKA_SERVER}/apps/{SERVICE_NAME.upper()}/{instance_id}", timeout=5
        )
        if r.status_code in (200, 204):
            print(f"♥️ Heartbeat envoyé pour {instance_id}")
        else:
            print(f"⚠️ Heartbeat erreur [{r.status_code}] {r.text}")
    except Exception as e:
        print(f"⚠️ Erreur Heartbeat: {e}")


def start_eureka_client():
    instance_id = register_to_eureka()
    schedule.every(30).seconds.do(lambda: send_heartbeat(instance_id))
    threading.Thread(target=lambda: run_scheduler(), daemon=True).start()


def run_scheduler():
    while True:
        try:
            schedule.run_pending()
        except Exception as e:
            print(f"⚠️ Erreur scheduler Eureka: {e}")
        time.sleep(1)
