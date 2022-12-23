$(document).ready(function() {
  // fonction qui gère le clic sur le bouton "Lancer un défi"
  $("#btn-launch-challenge").click(function() {
    // Récupération de la liste des épreuves à partir du fichier XML
    $.get("challenges.xml", function(xml) {
      // Sélection aléatoire d'une épreuve dans la liste
      var randomIndex = Math.floor(Math.random() * $(xml).find("challenge").length);
      var randomChallenge = $(xml).find("challenge").eq(randomIndex).text();

      // Affichage de l'épppreuve sélectionnée sur l'interface web
      $("#challenge-text").text(randomChallenge);
    });
  });
});
