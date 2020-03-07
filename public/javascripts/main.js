$(document).ready(function() {
    
    var clientID = 43716;

    $('#login-btn').click(function() {
        var accessURL = 'http://www.strava.com/oauth/authorize?client_id=43716&response_type=code&redirect_uri=http://localhost:3000/exchange_token&approval_prompt=force&scope=read_all';
        window.location.href = accessURL;
    });

});