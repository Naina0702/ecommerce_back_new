var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');

var boutique =require('../modals/boutique');

router.post('/',(req,res)=>{
    if (!req.body || !req.body.contact) {
        return res.status(400).json({ message: 'Données de requête incorrectes.' });
    }

    var email= req.body.contact;
    var mdp = req.body.password;

    boutique.findOne({contact: email, password:mdp})
        .then((boutiqueTrouve)=>{
            if (boutiqueTrouve) {
                console.log('Boutique trouvé :', boutiqueTrouve);
                res.send({
                    message:'ok'
                })
              } else {
                console.log('Aucun boutique correspondant n\'a été trouvé.');
                res.send({
                    message:'null'
                })
            }
        })


});

module.exports = router;