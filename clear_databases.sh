#!/bin/bash

# Directory del progetto
PROJECT_DIR="/home/giovanni/progetto"

# Nomi dei container MongoDB e dei database
MONGO1_CONTAINER="sito1-mongo"
MONGO2_CONTAINER="sito2-mongo"
DB1_NAME="sito1_db"
DB2_NAME="sito2_db"

# Controlla se la directory esiste
if [ ! -d "$PROJECT_DIR" ]; then
  echo "Errore: La directory del progetto $PROJECT_DIR non esiste."
  exit 1
fi

# Naviga nella directory del progetto
cd "$PROJECT_DIR" || {
  echo "Errore: Impossibile accedere alla directory $PROJECT_DIR"
  exit 1
}

if ! docker info >/dev/null 2>&1; then
  echo "Errore: Docker non è in esecuzione. Avvia Docker con 'sudo systemctl start docker'."
  exit 1
fi

if ! docker ps | grep -q "$MONGO1_CONTAINER"; then
  echo "Errore: Il container $MONGO1_CONTAINER non è in esecuzione. Avvia il progetto con './start_project.sh'."
  exit 1
fi
if ! docker ps | grep -q "$MONGO2_CONTAINER"; then
  echo "Errore: Il container $MONGO2_CONTAINER non è in esecuzione. Avvia il progetto con './start_project.sh'."
  exit 1
fi

echo "Svuotando il database $DB1_NAME nel container $MONGO1_CONTAINER..."
docker exec $MONGO1_CONTAINER mongosh $DB1_NAME --eval "db.reviews.drop()" || {
  echo "Errore durante lo svuotamento del database $DB1_NAME."
  exit 1
}

echo "Svuotando il database $DB2_NAME nel container $MONGO2_CONTAINER..."
docker exec $MONGO2_CONTAINER mongosh $DB2_NAME --eval "db.reviews.drop(); db.credentials.drop()" || {
  echo "Errore durante lo svuotamento del database $DB2_NAME."
  exit 1
}

echo "Verificando lo stato dei database..."
echo "Collezioni in $DB1_NAME:"
docker exec $MONGO1_CONTAINER mongosh $DB1_NAME --eval "db.getCollectionNames()"
echo "Collezioni in $DB2_NAME:"
docker exec $MONGO2_CONTAINER mongosh $DB2_NAME --eval "db.getCollectionNames()"

echo "Database $DB1_NAME e $DB2_NAME svuotati correttamente!"
echo "Le collezioni 'reviews' (entrambi) e 'credentials' (sito2_db) sono state rimosse."
echo "Puoi verificare accedendo ai siti:"
echo " - Sito 1: http://localhost:3000 (o http://<IP-VM>:3000)"
echo " - Sito 2: http://localhost:4000 (o http://<IP-VM>:4000)"
