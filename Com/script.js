$(document).ready(function() {
    $.get('challenges.xml', function(data) {
        var challenges = $(data).find('challenge');
        $('#generate-challenge').click(function() {
            var challenge = challenges.eq(Math.floor(Math.random() * challenges.length));
            $('#challenge-container').html(challenge.text());
        });
    });
});
