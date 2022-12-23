$(document).ready(function() {
  // Chargement du fichier XML contenant la liste des défis
  $.ajax({
    type: "GET",
    url: "challenges.xml",
    dataType: "xml",
    success: function(xml) {
      // Fonction appelée lorsque le chargement du fichier XML a réussi
      var challenges = $(xml).find("challenge"); // Récupération de tous les défis dans le fichier XML
      var totalChallenges = challenges.length; // Nombre total de défis dans le fichier XML
      
      // Gestion du clic sur le bouton "Lancer un défi"
      $("#launch-challenge").click(function() {
        // Tirage aléatoire d'un défi parmi la liste de tous les défis
        var randomIndex = Math.floor(Math.random() * totalChallenges);
        var challenge = $(challenges[randomIndex]).text(); // Récupération du texte du défi sélectionné
        
        // Affichage du défi sélectionné dans l'interface web
        $("#challenge-text").text(challenge);
      });
    }
  });
});
