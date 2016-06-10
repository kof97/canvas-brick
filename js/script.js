var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// 球
function Ball() {

    var _this = this;

    this.x = canvas.width / 2;
    this.y = canvas.height - 30;
    this.radius = 10;
    this.dx = 2;
    this.dy = -2;

    this.drawBall = function() {
        ctx.beginPath();
        ctx.arc(_this.x, _this.y, _this.radius, 0, Math.PI*2);
        ctx.fillStyle = "#83C931";
        ctx.fill();
        ctx.closePath();
    }

    this.ballInit = function() {
        _this.drawBall();
    }

}

// 板子
function Paddle() {

    var _this = this;

    this.height = 10;
    this.width = 75;
    this.x = (canvas.width - _this.width) / 2;
    this.speed = 10;
    this.rightPressed = false;
    this.leftPressed = false;

    this.drawPaddle = function () {
        ctx.beginPath();
        ctx.rect(_this.x, canvas.height - _this.height, _this.width, _this.height);
        ctx.fillStyle = "#4C8BF5";
        ctx.fill();
        ctx.closePath();
    }

    this.paddleInit = function() {
        _this.drawPaddle();
    }

}

// 砖块
function Brick() {

    var _this = this;

    this.row = 3;
    this.column = 5;
    this.width = 75;
    this.height = 20;
    this.brickPadding = 10;
    this.brickOffsetTop = 20;
    this.brickOffsetLeft = 30;
    this.bricks = (function() {
        var bricks = [];
        for (c = 0; c < _this.column; c++) {
            bricks[c] = [];
            for (r = 0; r < _this.row; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
        return bricks;

    }());   

    this.drawBricks = function() {

        for (c = 0; c < _this.column; c++) {
            for (r = 0; r < _this.row; r++) {
                if(_this.bricks[c][r].status == 1) {
                    var brickX = (c * (_this.width + _this.brickPadding)) + _this.brickOffsetLeft;
                    var brickY = (r * (_this.height + _this.brickPadding)) + _this.brickOffsetTop;
                    _this.bricks[c][r].x = brickX;
                    _this.bricks[c][r].y = brickY;

                    ctx.beginPath();
                    ctx.rect(brickX, brickY, _this.width, _this.height);
                    ctx.fillStyle = "#7EAAF6";
                    ctx.fill();
                    ctx.closePath();

                }
            }
        }
    }

    this.brickInit = function() {
        _this.drawBricks();
    }

}

// 得分
function Score() {

    var _this = this;

    this.score = 0;

    this.drawScore = function() {
        ctx.font = "15px Arial";
        ctx.fillStyle = "#0095DD";
        ctx.fillText("Score: " + _this.score, 1, 15);
    }

    this.scoreInit = function() {
        _this.drawScore();
    }

}

function Game() {

    this.run = null;

    var _this = this,
        ball = new Ball(),
        paddle = new Paddle(),
        brick = new Brick(),
        score = new Score();

    this.collisionTest = function() {

        if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = -ball.dx;
        };

        if (ball.y + ball.dy < ball.radius) {
            ball.dy = -ball.dy;
        } else if (ball.y + ball.dy > canvas.height - ball.radius) {
            if (ball.x > paddle.x - 10 && ball.x < paddle.x + paddle.width + 10) {
                ball.dy = -ball.dy;
            } else {
                // game over
                clearInterval(_this.run);
                // alert("game over");
                document.location.reload();
            };
            
        };

        // brick collision test
        for (c = 0; c < brick.column; c++) {
            for (r = 0; r < brick.row; r++) {
                var b = brick.bricks[c][r];
                if (b.status == 1) {
                    if (ball.x > b.x && ball.x < b.x + brick.width && ball.y > b.y && ball.y < b.y + brick.height) {
                        ball.dy = -ball.dy;
                        b.status = 0;
                        score.score++;

                    }
                }
            }
        }

        ball.x += ball.dx;
        ball.y += ball.dy;

    } 

    this.paddleMove = function() {

        if (paddle.rightPressed && paddle.x < canvas.width - paddle.width) {
            paddle.x += 7;
        } else if (paddle.leftPressed && paddle.x > 0) {
            paddle.x -= 7;
        }

    }

    this.draw = function() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ball.ballInit();
        paddle.paddleInit();
        brick.brickInit();
        score.scoreInit();

        _this.paddleMove();
        _this.collisionTest();
        
    }

    this.init = function() {

        var keyDownHandler = function(e) {
            if (e.keyCode == 37) {
                paddle.leftPressed = true;
            };

            if (e.keyCode == 39) {
                paddle.rightPressed = true;
            };
        }

        var keyUpHandler = function(e) {
            if (e.keyCode == 37) {
                paddle.leftPressed = false;
            };

            if (e.keyCode == 39) {
                paddle.rightPressed = false;
            };
        }

        // 监听
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);        

        _this.run = setInterval(_this.draw, 10);

    }
    
    return { init: _this.init() }

}

var game = new Game();
game.init;
