/*
  =============================================
  INITIALISATION
  =============================================
*/
var express = require('express');
var router = express.Router();

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

/*
  =============================================
  ROUTE HOME PAGE
  =============================================
*/
router.get('/', function(req, res, next) {

  console.log("Route INDEX");

  // Initialisation du Panier VIDE
  if (req.session.panier == undefined) {

    console.log("Route INDEX (initialisation)");
    req.session.panier = [];
    req.session.idCard = 0;
  }

  // Retour vers le panier SHOP
  res.render('index', { bikes: dataBikes});
});

/*
  =============================================
  ROUTE AJOUTER ARTICLE
  =============================================
*/
router.get('/shop', function(req, res, next) {

  console.log("Route SHOP (ADD)", req.query.idProduct);

  // Récupérer le panier de la session
  let dataCards = req.session.panier;

  // ___________________________________________________________________________
  // On récupère l'id, on retouve l'indice et on ajoute l'article dans le panier
  // ou on MàJ le panier en ajoutant une unité si l'article est déjà sélectionné.
  // Rechercher le produit par son ID
  // ___________________________________________________________________________
  const indice = dataBikes.findIndex(x => x.idProduct === req.query.idProduct);

  // Vérifier si cet article existe dans le panier
  const indiceCard = dataCards.findIndex(x => x.idProduct === req.query.idProduct);
  if (indiceCard == -1) {

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
        idProduct: dataBikes[indice].idProduct
      }
    );
    // Sauvegarder l'ID dans la session
    req.session.idCard = idCard;
  } else {

    // MàJ de la quantité (+1)
    dataCards[indice].qty += 1;
    dataCards[indice].total = dataCards[indice].qty * dataCards[indice].price;
  }

  // MàJ du total panier
  let basketTotal = totalCard(dataCards);

  // Sauvegarder le panier dans la session
  req.session.panier = dataCards;

  // Retour vers le panier SHOP
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

  // Retour vers le panier SHOP
  res.render('shop', { cards: dataCards, cardTotal: basketTotal });
});

/*
  =============================================
  ROUTE ACTUALISER OU SUPPRIMER ARTICLE PANIER
  =============================================
*/
router.post('/refreshItem', function(req, res, next) {

  console.log("Route REFRESH")
  console.log('ID:', req.body.idCard);
  console.log('QTY:', req.body.qty);

  // Récupérer le panier de la session
  let dataCards = req.session.panier;

  // On récupère l'id de l'article à modifier dans le panier
  const indice = dataCards.findIndex(x => x.idCard === parseInt(req.body.idCard));
  if (req.body.qty != 0) {
    // Recalculer le montant de la ligne et le total du panier
    dataCards[indice].qty = req.body.qty;
    dataCards[indice].total = dataCards[indice].qty * dataCards[indice].price;
  }
  else {
    // Si la quantité = 0, on supprime l'item du panier
    dataCards.splice(indice, 1);
  }
  let basketTotal = totalCard(dataCards);

  // Sauvegarder le panier dans la session
  req.session.panier = dataCards

  // Retour vers le panier SHOP
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
  const indice = dataCards.findIndex(x => x.idCard === parseInt(req.body.idCard));
  console.log(indice)

  dataCards.splice(indice, 1);
  let basketTotal = totalCard(dataCards);

  // Sauvegarder le panier dans la session
  req.session.panier = dataCards

  // Retour vers le panier SHOP
  res.render('shop', { cards: dataCards, cardTotal: basketTotal });
});

/*
FIN DU MODULE
*/
module.exports = router;
