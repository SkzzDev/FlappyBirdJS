$(document).ready(function() {

    function createNewPipe(i = null)
    {
        var h = Math.floor(Math.random() * (max - min) + min);
        if (i == null) i = pipe.count;
        return [h, draw.rect(pipe.size, h).move(pipe.startOffset + (i * pipe.spaceBetween), 0).fill('red'), draw.rect(pipe.size, system.sheight - h + pipe.gap).move(pipe.startOffset + (i * pipe.spaceBetween), h + pipe.gap).fill('red')];
    }

    // Computing vars
    var i = 0, j = 0;

    var gameStarted = 0;

    var system = {
        'swidth': $('#container').width(),
        'sheight': $('#container').height(),
        'gravity': 23,
        'worldTravelSpeed': 24,
        'jumpVelocity': 60
    };
    var draw = SVG('drawing').size(system.swidth, system.sheight); // Set default SVG Canvas
    var body = $("body"), canvas = $("#drawing");
    var canvasOffset = canvas.offset();

    var cell = {
        'size': 30,
        'hSize': 15,
        'velocity': system.jumpVelocity,
        'spawnY': 220
    };
    var pipe = {
        'size': 80,
        'gap': 140,
        'count': 5,
        'startOffset': 600,
        'spaceBetween': 370
    }
    var pipesWiped = 0;

    var bird = {
        'x': 100,
        'y': cell.spawnY,
        'dead': 0
    };
    bird.sprite = draw.rect(cell.size, cell.size).move(bird.x, bird.y).fill('#ffffff');
    
    var pipes = [];
    var min = cell.hSize * 3, max = system.sheight - (cell.hSize * 3) - pipe.gap;
    for (i = 0; i < pipe.count; i++) pipes[i] = createNewPipe(i);

    var tstart = 0, tcstart = 0, tnow = 0, dt = 0, dct = 0;
    var pos = 0;
    var click = 1;


    $(body).mousedown(function() {
        if (gameStarted) {
            cell.velocity = system.jumpVelocity;
            bird.y = bird.sprite.y();
            tcstart = Date.now();
            click = 1;
        }
    });

    $(body).keydown(function(event) {
        if (event.which == 83 && !gameStarted) {
            gameStarted = true;
            click = 1;
            pipesWiped = 0;
            bird.y = cell.spawnY;
            bird.sprite.y(bird.y);
            if (bird.dead != 0) {
                for (i = 0; i < pipe.count; i++) {
                    pipes[i][1].remove();
                    pipes[i][2].remove();
                    pipes[i] = createNewPipe(i);
                }
            }
            tstart = Date.now();
            tcstart = Date.now();
            
            gameFrame = setInterval(function() {
                tnow = Date.now();
                dt = (tnow - tstart) / 100;
                if (pos != system.sheight - cell.size || click != 0) {
                    dct = (tnow - tcstart) / 100;
                    click = 0;
                    pos = bird.y - (cell.velocity * dct) + (1/2.0)*system.gravity*(dct*dct);
                    if (pos > system.sheight - cell.size) {
                        pos = system.sheight - cell.size
                    } else if (pos < 0) {
                        pos = 0; bird.y = pos;
                        cell.velocity = 0;
                        tcstart = Date.now();
                    }
                    bird.sprite.y(pos);
                }
                for (i = 0; i < pipe.count; i++) {
                    pipes[i][1].x(pipe.startOffset + ((i+pipesWiped) * pipe.spaceBetween) - (dt * system.worldTravelSpeed));
                    pipes[i][2].x(pipe.startOffset + ((i+pipesWiped) * pipe.spaceBetween) - (dt * system.worldTravelSpeed));
                }
                if ((bird.x + cell.size >= pipes[0][1].x() && bird.x <= pipes[0][1].x() + pipe.size) && (bird.sprite.y() < pipes[0][0] || bird.sprite.y() + cell.size > pipes[0][0] + pipe.gap)) {
                    gameStarted = false;
                    bird.dead = 1;
                    clearInterval(gameFrame);
                } 
                if (pipes[0][1].x() < -pipe.size) {
                    pipesWiped++;
                    pipes[0][1].remove();
                    pipes[0][2].remove();
                    for (i = 0; i < pipe.count - 1; i++) pipes[i] = pipes[i + 1];
                    pipes[pipe.count - 1] = createNewPipe();
                }
            }, 6);
        }
    });

});