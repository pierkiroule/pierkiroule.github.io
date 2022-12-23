$(document).ready(function() {
  // Récupération de la liste des épreuves au format XML
  $.get("challenges.xml", function(xml) {
    // Fonction de callback qui sera exécutée une fois la liste des épreuves récupérée

    // Sélection aléatoire d'un défi dans la liste
    var randomIndex = Math.floor(Math.random() * $(xml).find("challenge").length);
    var challenge = $(xml).find("challenge").eq(randomIndex).text();

    // Affichage du défi sélectionné dans le formulaire
    $("#challenge-form").text(challenge);

    // Gestion du click sur le bouton "Lancer un défi"
    $("#launch-challenge-button").click(function() {
      // Sélection d'un nouveau défi aléatoire et mise à jour de l'affichage
      randomIndex = Math.floor(Math.random() * $(xml).find("challenge").length);
      challenge = $(xml).find("challenge").eq(randomIndex).text();
      $("#challenge-form").text(challenge);
    });
  });
});
