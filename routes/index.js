/*
  =============================================
  INITIALISATION
  =============================================
*/
var express = require('express');
var router = express.Router();
var session = require("express-session");

// fonction de calcul du total panier
function totalCard(dataCards) {
  let total = 0   // Total panier
  for (var i = 0; i < dataCards.length; i++) {
    const itemTotal = dataCards[i].price * dataCards[i].qty
    dataCards[i].total = itemTotal
    total += itemTotal;
  }
  return total;
};

/*
=====================================
GLOBALE : CATALOGUE
=====================================
*/
// Liste des articles
var dataBikes = [
  {idProduct: "1", model: "vélo 1", price: 100, srcImage: "bike-1.jpg"},
  {idProduct: "24", model: "vélo 2", price: 200, srcImage: "bike-2.jpg"},
  {idProduct: "3", model: "vélo 3", price: 300, srcImage: "bike-3.jpg"},
  {idProduct: "41", model: "vélo 4", price: 400, srcImage: "bike-4.jpg"},
  {idProduct: "5", model: "vélo 5", price: 500, srcImage: "bike-5.jpg"},
  {idProduct: "63", model: "vélo 6", price: 600, srcImage: "bike-6.jpg"},
  {idProduct: "74", model: "vélo 7", price: 700, srcImage: "bike-4.jpg"},
  {idProduct: "81", model: "vélo 8", price: 800, srcImage: "bike-5.jpg"}
];
//var panier = [];

/*
  =============================================
  ROUTE HOME PAGE
  =============================================
*/
router.get('/', function(req, res, next) {

  console.log("Route INDEX");
  //console.Clear()

  // Initialisation du Panier VIDE
  if (req.session.panier == undefined) {

    console.log("Route INDEX (initialisation)");
    req.session.panier = [];
    req.session.idCard = 0;
  }

  res.render('index', { bikes: dataBikes});
});

/*
  =============================================
  ROUTE AJOUTER ARTICLE
  =============================================
*/
router.get('/shop', function(req, res, next) {

  // On récupère l'id, on retouve l'indice et on ajoute l'article dans le panier
  console.log("Route ADD", req.query.idProduct);
  console.log("PANIER", req.session.panier);

  // Récupérer le panier de la session
  let dataCards = req.session.panier;
  //console.log("DataCards", dataCards)

  // Rechercher le produit par son ID
  const indice = dataBikes.findIndex(x => x.idProduct === req.query.idProduct);
  console.log(indice, dataBikes[indice].model);

  // Ajouter le nouvel article dans le panier
  let idCard = req.session.idCard + 1;
  dataCards.push(
    {
      idCard: idCard,
      srcImage: dataBikes[indice].srcImage,
      model: dataBikes[indice].model,
      qty: 1,
      price: dataBikes[indice].price,
      total: dataBikes[indice].price,
      idProduct: req.query.id
    }
  );
  //console.log(dataCards.length);

  // MàJ du panier
  let basketTotal = totalCard(dataCards);
  //console.log(dataCards[i].price)
  //console.log("Total:" + basketTotal);
  //console.log(dataCards);

  // Sauvegarder le panier dans la session
  req.session.panier = dataCards;
  req.session.idCard = idCard;
  console.log("SESSION: ", req.session)

  res.render('shop', { cards: dataCards, cardTotal: basketTotal });
});

/*
  =============================================
  ROUTE MONTRER LE PANIER
  =============================================
*/
router.get('/showCard', function(req, res, next) {
  console.log("Route CARD");

  // Récupérer le panier de la session
  let dataCards = req.session.panier;
  //console.log(dataCards);
  let basketTotal = totalCard(dataCards);

  res.render('shop', { cards: dataCards, cardTotal: basketTotal });
});

/*
  =============================================
  ROUTE ACTUALISER OU SUPPRIMER ARTICLE PANIER
  =============================================
*/
router.post('/refreshItem', function(req, res, next) {

  console.log("Route REFRESH", req.body.idCard)
  console.log('ID:', req.body.id)
  console.log('QTY:', req.body.qty)

  // Récupérer le panier de la session
  let dataCards = req.session.panier;

  // Recalculer le montant de la ligne et le total du panier
  const indice = dataCards.findIndex(x => x.idCard === req.body.id);
  console.log(dataCards, indice);
  if (req.body.qty != 0) {
    // On récupère l'id, on retouve l'indice et on ajoute l'article dans le panier
    //console.log(indice, dataCards[indice].id);
    dataCards[indice].qty = req.body.qty;
    dataCards[indice].total = dataCards[indice].qty * dataCards[indice].price;
    //console.log(dataCards.length);
    //console.log(basketTotal)
  }
  else {
    dataCards.splice(indice, 1);
  }
  let basketTotal = totalCard(dataCards);

  // Sauvegarder le panier dans la session
  req.session.panier = dataCards

  res.render('shop', { cards: dataCards, cardTotal: basketTotal });
});

/*
  =============================================
  ROUTE DELETE
  =============================================
*/
router.post('/deleteItem', function(req, res, next) {

  console.log("Route DELETE");
  console.log('ID:', req.body.id)

  // Récupérer le panier de la session
  let dataCards = req.session.panier;

  // Supprimer l'item du panier
  const indice = dataCards.findIndex(x => x.id == req.body.id);
  console.log(indice)

  dataCards.splice(indice, 1);
  let basketTotal = totalCard(dataCards);

  // Sauvegarder le panier dans la session
  req.session.panier = dataCards

  res.render('shop', { cards: dataCards, cardTotal: basketTotal });
});

module.exports = router;
