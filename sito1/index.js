const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Configurazione MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo1:27017/sito1_db')
  .then(() => console.log('Connesso a MongoDB'))
  .catch(err => console.error('Errore connessione MongoDB:', err));

// Schema per le recensioni
const reviewSchema = new mongoose.Schema({
  name: String,
  email: String,
  rating: Number,
  text: String,
});
const Review = mongoose.model('Review', reviewSchema);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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

// Route GET per /review (reindirizza alla homepage)
app.get('/review', (req, res) => {
  res.redirect('/');
});

// Route POST per inviare recensioni
app.post('/review', async (req, res) => {
  const { name, email, rating, review } = req.body;

  // Validazione minima
  if (!name || !email || !rating || !review) {
    return res.render('index', {
      reviews: await Review.find(),
      errorMessage: 'Compila tutti i campi.',
    });
  }

  try {
    const newReview = new Review({
      name, // Non sanitizzare
      email, // Non sanitizzare
      rating: parseInt(rating),
      text: review // Non sanitizzare
    });
    await newReview.save();
    res.redirect('/');
  } catch (err) {
    console.error('Errore salvataggio recensione:', err);
    res.render('index', {
      reviews: await Review.find(),
      errorMessage: 'Errore durante il salvataggio della recensione. Riprova.',
    });
  }
});

// Gestione errori generici
app.use((err, req, res, next) => {
  console.error('Errore server:', err);
  res.status(500).render('index', {
    reviews: [],
    errorMessage: 'Errore interno del server. Riprova più tardi.',
  });
});

// Avvio del server
const PORT = process.env.PORT || 3000; // sito1 usa 3000, sito2 userà 4000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});