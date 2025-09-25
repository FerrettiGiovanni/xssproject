# Progetto per Esame di Sicurezza: Attacco XSS Stored  

**Attenzione**: Questo progetto è solo per studio, non usarlo su siti veri o per fare cose illegali!  

Questo progetto mostra come funziona un attacco **XSS Stored** su un sito vulnerabile (Sito1) e come si può combinare con un attacco di phishing su un altro sito (Sito2).  

Sito1 è un'app che non controlla bene gli input, permettendo di inserire codice JavaScript pericoloso.  
Sito2 invece finge di essere un login di Google per rubare email e password.  

## Cosa fa il progetto  
- **Obiettivo**: Far vedere come un attaccante può usare XSS per rubare dati (tipo email) e mandare gli utenti su un sito di phishing  
- **Tecnologie usate**: Node.js, Express, MongoDB, Docker, EJS.  

## Come è fatto  
- **Sito1** (porta 3000): Mostra il meteo di Roma (usando l'API Open-Meteo) e ha una sezione per lasciare recensioni (vulnerabile a XSS).  
- **Sito2** (porta 4000): Sito falso che sembra un login di Google e salva le credenziali inserite.  
- **Docker**: I siti girano in container separati con MongoDB.  

## Cosa serve  
- Docker e Docker Compose installati.  
- Un computer con Bash 
- Connessione a internet per scaricare le dipendenze.  

## Come far partire il progetto  
1. Avvia tutto con:  
   ```bash
   ./start_project.sh
   ```  
   Questo fa partire Sito1 (http://localhost:3000), Sito2 (http://localhost:4000) e i database.  

2. Vai sui siti:  
   - Sito1: http://localhost:3000  
   - Sito2: http://localhost:4000  

3. Per spegnere tutto:  
   ```bash
   ./stop_project.sh
   ```  

4. Per cancellare i dati nei database:  
   ```bash
   ./clear_databases.sh
   ```  

## Come provare l'attacco  
1. Su Sito1, nella sezione recensioni, metti uno script malevolo (trovi un esempio in `script.txt`).  
2. Guarda se lo script funziona: dovrebbe mandare dati a Sito2 e aprire il sito di phishing.  
3. Prova a mettere email e password finte su Sito2 per vedere come vengono rubate.  

## Database  
Per vedere i dati salvati nei database:  

1. **Sito1** (collezione `reviews`):  
   ```bash
   docker exec -it sito1-mongo mongosh sito1_db
   ```  
   Poi:  
   ```javascript
   db.reviews.find()
   db.reviews.countDocuments()
   exit
   ```  

2. **Sito2** (collezioni `reviews` e `credentials`):  
   ```bash
   docker exec -it sito2-mongo mongosh sito2_db
   ```  
   Poi:  
   ```javascript
   db.reviews.find()
   db.credentials.find()
   exit
   ```  

3. Per cancellare tutto il contenuto del db:  
   ```bash
   ./clear_databases.sh
   ```  

## Note  
- Progetto solo per studio, non usarlo per intraprendere azioni malevoli  
- Creato da: **Giovanni Ferretti**, matricola 2070106  
- Corso: Sicurezza, Università di Roma La Sapienza  
- Anno: 2024/2025  
