var game = {};

var gameOver = false;

var canShoot = true;
var enemyVelocity = 5;

var shootSound = document.getElementById('shootSound');
var explosionSound = document.getElementById('explosionSound');
var backgroundSound = document.getElementById('backgroundSound');
var gameoverSound = document.getElementById('gameoverSound');
var lostSound = document.getElementById('lostSound');
var rescueSound = document.getElementById('rescueSound');

function setup() {
    game = {};
    gameOver = false;
    game.score = 0;
    game.rescued = 0;
    game.lost = 0;
    game.life = 3;
    game.pressed = [];
    canShoot = true;
    enemyVelocity = 5;

    $("#background").append("<div id=player class=anima1></div>");
    $("#background").append("<div id='enemy1' class=anima2></div>");
    $("#background").append("<div id='enemy2'></div>");
    $("#background").append("<div id='friend' class=anima3></div>");
    $("#background").append("<div id='score'></div>");
    $("#background").append("<div id='life'></div>");
    }

function start(){
    $("#start").hide();


    



    const keys = {
        W : 87,
        S : 83,
        D : 68
    };

    setup();





    $(document).keydown(function(e){game.pressed[e.which] = true});
    $(document).keyup(function(e){game.pressed[e.which] = false});

    game.timer = setInterval(Update,30);
    backgroundSound.addEventListener("ended", function(){ backgroundSound.currentTime = 0; backgroundSound.play();},false)
    backgroundSound.play();

    function Update(){
        movebackground();
        characterMovement();
        enemy1Movement();
        enemy2Movement();
        friendMovement();
        collision();
        updateScore();
    }

    function characterMovement(){
        if (game.pressed[keys.W]){
            var position = parseInt($('#player').css('top'));
            if (position > 10){
                $('#player').css('top', position -10);
            }
            
        }

        if (game.pressed[keys.S]){
            var position = parseInt($('#player').css('top'));
            if (position < 460){
                $('#player').css('top', position + 10);
            }
        }

        if (game.pressed[keys.D]){
            shoot();
        }
    }

    function shoot(){
        if (canShoot === true){
            shootSound.play();
            canShoot = false;

            var top = parseInt($('#player').css('top'));
            var left = parseInt($('#player').css('left'));

            var projectileX = left + 190;
            var projectileY = top + 30;

            $('#background').append("<div id=shoot></div>");
            $('#shoot').css('top',projectileY);
            $('#shoot').css('left',projectileX);

            var shootTimer = setInterval(execution,30);

        }

            function execution(){
                positionX = parseInt($('#shoot').css('left'));
                $('#shoot').css('left', positionX + 15);

                if (positionX > 750){
                    window.clearInterval(shootTimer);
                    shootTimer = null;
                    $('#shoot').remove();
                    canShoot = true;
                }
        }
    }

    function enemy1Movement(){
        var enemy1PositionX = parseInt($('#enemy1').css('left'));
        var enemy1PositionY = parseInt($('#enemy1').css('top'));
        $('#enemy1').css('left', enemy1PositionX - enemyVelocity);
        $('#enemy1').css('top', enemy1PositionY);

        if (enemy1PositionX < 0){
            enemy1PositionY = parseInt(Math.random() * 345);
            $('#enemy1').css('left', 700);
            $('#enemy1').css('top', enemy1PositionY);
        }

    }

    function enemy2Movement(){
        var enemy2PositionX = parseInt($('#enemy2').css('left'));
        $('#enemy2').css('left', enemy2PositionX - enemyVelocity/3);

        if (enemy2PositionX < 0){
            $('#enemy2').css('left', 700);
        }

    }

    function friendMovement(){
        var friendPositionX = parseInt($('#friend').css('left'));
        $('#friend').css('left', friendPositionX + 1);

        if (friendPositionX > 700){
            $('#friend').css('left', 0);
        }

    }

    function movebackground(){
        left = parseInt($('#background').css('background-position'));
        $('#background').css('background-position',left-1);
    }

    function collision(){
        var check1 = $('#player').collision($('#enemy1'));
        var check2 = $('#player').collision($('#enemy2'));
        var check3 = $('#shoot').collision($('#enemy1'));
        var check4 = $('#shoot').collision($('#enemy2'));
        var check5 = $('#player').collision($('#friend'));
        var check6 = $('#friend').collision($('#enemy2'));

        if (check1.length > 0){
            game.life--;
            var enemy1PositionX = parseInt($('#enemy1').css('left'));
            var enemy1PositionY = parseInt($('#enemy1').css('top'));
            explosion(1,enemy1PositionX,enemy1PositionY);
            Y = parseInt(Math.random() * 345);
            $('#enemy1').css('left', 700);
            $('#enemy1').css('top', Y);
        }

        if (check2.length > 0){
            game.life--;
            var enemy2PositionX = parseInt($('#enemy2').css('left'));
            var enemy2PositionY = parseInt($('#enemy2').css('top'));
            explosion(2,enemy2PositionX,enemy2PositionY);
            $('#enemy2').remove();
            setTimeout(() => $("#background").append("<div id='enemy2'></div>"),5000)
        }

        if (check3.length > 0){
            game.score += 100;
            enemyVelocity += 0.3;
            var enemy1PositionX = parseInt($('#enemy1').css('left'));
            var enemy1PositionY = parseInt($('#enemy1').css('top'));
            explosion(1,enemy1PositionX,enemy1PositionY);
            $(`#shoot`).css('left',900);

            Y = parseInt(Math.random() * 345);
            $('#enemy1').css('left', 700);
            $('#enemy1').css('top', Y);
        }

        if (check4.length > 0){
            game.score += 50;
            enemyVelocity += 0.3;
            var enemy2PositionX = parseInt($('#enemy2').css('left'));
            var enemy2PositionY = parseInt($('#enemy2').css('top'));
            explosion(2,enemy2PositionX,enemy2PositionY);
            $(`#shoot`).css('left',1000);
            $('#enemy2').remove();
            if (gameOver === false){
                setTimeout(() => $("#background").append("<div id='enemy2'></div>"),5000);
            }
            
        }

        if (check5.length > 0){
            rescueSound.play();
            game.rescued++;
            $('#friend').remove();
            if (gameOver === false) {
                setTimeout(() => $("#background").append("<div id='friend' class=anima3></div>"),7000);
            }
        }

        if (check6.length > 0){
            game.lost++;
            var friendX = parseInt($('#friend').css('left'));
            var friendY = parseInt($('#friend').css('top'));
            death(friendX,friendY);
            $('#friend').remove();
            if (gameOver === false) {
                setTimeout(() => $("#background").append("<div id='friend' class=anima3></div>"),7000);
            }
        }
        
    }

    function explosion(i,x,y){
        explosionSound.play();
        $('#background').append(`<div id=explosion${i}></div>`);
        $(`#explosion${i}`).css( 'background-image', "url('Assets/explosao.png')");
        var div = $(`#explosion${i}`);
        div.css('top', y)
        div.css('left',x)
        div.animate({width:200, opacity:0},'slow');

        var explosionTimer = setInterval(removeExplosion,1000);

        function removeExplosion(){
            div.remove();
            window.clearInterval(explosionTimer);
            explosionTimer = null;
        }
    }

    function death(x,y){
        lostSound.play();
        $('#background').append(`<div id=death class=anima4></div>`);
        var div = $(`#death`);
        div.css('top', y)
        div.css('left',x)

        setTimeout(() => div.remove(),1000);

        
    }

    function updateScore(){
        $('#score').html("<h2> Score = " + game.score + " Rescued = " + game.rescued + " Lost = " + game.lost+ "</h2>");

        if (game.life === 3){
            $('#life').css('background-image', "url('Assets/energia3.png')");
        }
        if (game.life === 2){
            $('#life').css('background-image', "url('Assets/energia2.png')");
        }
        if (game.life === 1){
            $('#life').css('background-image', "url('Assets/energia1.png')");
        }
        if (game.life === 0){
            $('#life').css('background-image', "url('Assets/energia0.png')");

            gameOver = true;
            backgroundSound.pause();
            gameoverSound.play();

            $('#player').remove();
            $('#enemy1').remove();
            $('#enemy2').remove();
            $('#friend').remove();

            if ($('#end').length < 1)
            {
                $('#background').append('<div id=end></div>');
                $('#end').html('<h1>Game Over</h1><button onclick=reset() ><h3>Play Again</h3></button>');
                console.log($('#end').length);
            } 
            
        }
    }

}

function reset(){
    gameoverSound.pause();
    backgroundSound.play();
    $('#end').remove();
    setup();
}