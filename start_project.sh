#!/bin/bash

PROJECT_DIR="/home/giovanni/progetto"

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

echo "Fermando eventuali container precedenti..."
docker-compose down

echo "Avviando i container Docker..."
docker-compose up --build -d

echo "Container attivi:"
docker ps

# Configura il firewall per consentire le porte necessarie
echo "Configurando il firewall..."
sudo ufw allow 3000
sudo ufw allow 4000
sudo ufw allow 27017
sudo ufw allow 27018

echo "Stato del firewall:"
sudo ufw status

echo "Mostrando i log iniziali dei container..."
docker-compose logs --tail=10

# Messaggio finale
echo "Progetto avviato correttamente!"
echo "Accedi ai siti:"
echo " - Sito 1: http://localhost:3000"
echo " - Sito 2: http://localhost:4000"
