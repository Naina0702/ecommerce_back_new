const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Connectez-vous à votre base de données MongoDB
mongoose.connect('mongodb://localhost/monapp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

// Créez un modèle utilisateur (avec Mongoose)
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String
}));

// Configuration de Passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    res.send('Accueil');
});

// Page de login
app.get('/login', (req, res) => {
    res.send('Page de login');
});

// Authentification
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}));

// Page de tableau de bord après la connexion réussie
app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Tableau de bord');
    } else {
        res.redirect('/login');
    }
});

// Déconnexion
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Le serveur est en cours d\'exécution sur le port 3000');
});