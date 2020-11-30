/////////////////////////////////////////////////
///////////     GLOBAL VARIABLES     ///////////      
/////////////////////////////////////////////////      
var LIFE = 3
var SCORE = 0
var SCORE_ADD = 10

var brick_hit = new Audio()
var life_lost = new Audio()
var win = new Audio()
var underwater = new Audio()

var step = 0; // FOR THE MOUVEMENT OF THE WAVE


/////////////////////////////////////////////////
///////////    PRINCIPAL PROGRAMM     ///////////      
/////////////////////////////////////////////////

window.onload = function () {

    /////////////////////////////////////////////////
    ///////////        DECLARATIONS      ///////////      
    /////////////////////////////////////////////////       

    //SELECT CANVAS elements
    const paddleCanvas = document.querySelector('#paddleCanvas')
    const context1 = paddleCanvas.getContext('2d')

    const ballCanvas = document.querySelector('#ballCanvas')
    const context2 = ballCanvas.getContext('2d')

    let bricksCanvas = document.querySelector('#bricksCanvas')
    let context3 = bricksCanvas.getContext('2d')


    //SELECT HTML ELEMENTS
    const gameOver1 = document.querySelector('#gameOver')
    const youWon = document.querySelector('#youWon')
    const youLose = document.querySelector('#youLose')



    ////////////////////////////////////////////
    /////////         VARIABLES        /////////
    ////////////////////////////////////////////

    //PADDLE VARIABLES
    const paddleWidth = 100
    const paddleHeight = 100
    const marginBottom = 10

    //BALL VARIABLES
    let ballRadius = 8

    //BRICKS VARIABLES
    let bricks = []


    ///////////////////////////////////////////////
    /////////     OBJECTS & PROPERTIES    /////////
    ///////////////////////////////////////////////

    //SET THE PADDLE PROPERTIES
    let paddle = {
        x: paddleCanvas.width / 2 - paddleWidth / 2,
        y: paddleCanvas.height - paddleHeight - marginBottom,
        width: paddleWidth,
        height: paddleHeight,
        step: 30
    }

    //SET THE BALL PROPERTIES
    let ball = {
        x: ballCanvas.width / 2,
        y: paddle.y - ballRadius,
        radius: ballRadius,
        dx: 3 * (Math.random() * 2 - 1),
        dy: -3,
        speed: 3

    }

    //SET THE BRICKS PROPERTIES
    let brick = {
        row: 5,
        column: 12,
        width: 50,
        height: 50,
        offSetLeft: 5,
        offSetTop: 10,
        marginTop: 5
    }

    //LOAD SOUND
    brick_hit.src = './sounds/brick_hit.mp3'
    life_lost.src = './sounds/life_lost.mp3'
    win.src = './sounds/win.mp3'
    underwater.src = './sounds/underwater.wav'



    ///////////////////////////////////////////////
    /////////        CALL FUNCTIONS       /////////
    ///////////////////////////////////////////////

    //CALL PADDLE FUNCTIONS
    drawPaddle(context1, paddle)
    movePaddle(context1, paddle, paddleCanvas)

    //CALL BRICKS FUNCTIONS
    createBoxesBricks(context3, brick, bricks)
    createDelphinBricks(context3, brick, bricks)
    createDifferentsBricks(context3, brick, bricks)

    //CALL THE OCTOPUS FUNCTIONS
    createOctopus(context3)

    //CALL FISCHNET FUNCTIONS
    createNet(context1, 60, 12)
    createNet(context1, 330, 12)


    //CALL BALL FUNCTIONS
    //SET A LOOP FOR THE MOUVEMENT OF THE BALL
    let loop = setInterval(() => {

        //CLEAR THE BALL CANVAS
        context2.clearRect(0, 0, ballCanvas.width, ballCanvas.height);

        //CALL BALL FUNCTION
        drawBall(context2, ball)

        //CALL THE COLLISION FUNCTIONS
        ballWallCollision(ball, ballCanvas, paddle, gameOver1, youLose, loop)
        ballPaddleCollision(ball, paddle)
        ballBricksCollision(context3, brick, bricks, ball, gameOver1, youWon, loop)

        //SET A STEP TO THE BALL
        ball.x += ball.dx
        ball.y += ball.dy


        //SHOW SCORE
        showGameStatus(context2, SCORE, 50, 40)
        //SHOW LIVES
        showGameStatus(context2, LIFE, paddleCanvas.width - 25, 40)
        //UNDERWATER SOUND
        underwater.play()

        draw(context2) // to draw an animated wave

    }, 20);

    plotSine(context3, 285, step, 157, 385); // to draw a fixed wave
    showImageStatus(context3, './imgs/score.png', 0, 5, 50, 50)
    showImageStatus(context3, './imgs/heart.png', paddleCanvas.width - 70, 5, 50, 50)


}



/////////////////////////////////////////////////
///////////          FUNCTIONS        ///////////      
/////////////////////////////////////////////////

//DRAW PADDLE
function drawPaddle(context1, paddle) {
    //create html image
    let img = document.createElement('img')
    //set src to the image
    img.src = './imgs/submarin.gif'

    //create onload events for img to add it inside convas after loading
    img.addEventListener('load', function () {
        context1.drawImage(img, paddle.x, paddle.y, paddle.width, paddle.height)
    })
}

//MOVE THE PADDLE
function movePaddle(context1, paddle, paddleCanvas) {

    document.onkeydown = (e) => {
        context1.clearRect(paddle.x, paddle.y, paddleCanvas.width, paddleCanvas.height)

        if (e.key == 'ArrowRight' && paddle.x + paddle.width < paddleCanvas.width) {

            paddle.x += paddle.step

        } else if (e.key == 'ArrowLeft' && paddle.x > 0) {

            paddle.x -= paddle.step

        }

        drawPaddle(context1, paddle)
    }

    document.onkeyup = (e) => {
        context1.clearRect(paddle.x, paddle.y, paddleCanvas.width, paddleCanvas.height)

        if (e.key == 'ArrowRight' && paddle.x + paddle.width < paddleCanvas.width) {

            paddle.x += paddle.step

        } else if (e.key == 'ArrowLeft' && paddle.x > 0) {

            paddle.x -= paddle.step

        }

        drawPaddle(context1, paddle)
    }
}

//DRAW BALL
function drawBall(context2, ball) {
    context2.beginPath();
    context2.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context2.fillStyle = "#ffcdo5"
    context2.fill()
    context2.closePath();
}



/////////////////////////////
/// DRAW DIFFERENTS BRICKS  //
/////////////////////////////

//DRAW BOXES
function createBoxesBricks(ctx, brick, bricks) {

    for (let r = 4; r < brick.row; r++) { //to create the rows
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) { //to create the columns
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true //that mean that the brick is not destroyed
            }

            if (bricks[r][c].status) {
                let imgBox = document.createElement('img')
                imgBox.src = './imgs/box.png'

                imgBox.addEventListener('load', function () { //load because we create the image so it will take time to be onload
                    ctx.drawImage(imgBox, bricks[r][c].x, bricks[r][c].y, brick.width, brick.height)
                })
            }
        }
    }
}

//CREATE A LIGNE OF MOVING DELPHINS
function createDelphinBricks(ctx, brick, bricks) {

    for (let r = 3; r < brick.row - 1; r++) { //to create the rows
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) { //to create the columns
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true //that mean that the brick is not destroyed
            }

            if (bricks[r][c].status) {

                //create Image
                let img = document.createElement('img')
                img.src = './imgs/delphin.png'

                img.addEventListener('load', function () { //load because we create the image so it will take time to be onload

                    let imgCounter = 9
                    let brickInterval = setInterval(() => {

                        //clear drawing area (x,  y, width, height)
                        ctx.clearRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height)
                        ctx.drawImage(img, imgCounter, 547.8, 84, 68, bricks[r][c].x, bricks[r][c].y, brick.width, brick.height)
                        imgCounter += 84

                        if (imgCounter == 345) {
                            imgCounter = 343.2
                        }

                        //RESTART THE DRAWING PROCESS EHEN WE ARRIVE TO 427.2
                        if (imgCounter == 427.2) {
                            imgCounter = 9
                        }

                    }, 300);

                    //SET A PROPERTIE TO THE BRICK TO STOP IT WHEN THE BALL CRASH THE BRICK
                    bricks[r][c].interval = brickInterval

                })
            }
        }
    }
}

//CREATE OF MOVING SHARK
function createDifferentsBricks(ctx, brick, bricks) {

    for (let r = 1; r < brick.row - 2; r++) { //to create the rows
        bricks[r] = [];

        //FOR EACH LINE WE WILL CREATE A DIFFERENT BRICK
        //THOSE COLUMNS WILL BE SHARK BRICK ON THE LEFT
        for (let c = 0; c < r; c++) { //to create the columns
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true //that mean that the brick is not destroyed
            }

            if (bricks[r][c].status) {

                let imgShark = document.createElement('img')
                imgShark.src = './imgs/shark.png'

                imgShark.addEventListener('load', function () { //load because we create the image so it will take time to be onload

                    let imgCounter = 0
                    let brickInterval1 = setInterval(() => {

                        //clear drawing area (x,  y, width, height)
                        ctx.clearRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height)

                        //draw the shark image
                        ctx.drawImage(imgShark, imgCounter, 562, 156, 130, bricks[r][c].x, bricks[r][c].y, brick.width, brick.height)
                        imgCounter += 156

                        //RESTART THE DRAWING PROCESS EHEN WE ARRIVE TO 427.2
                        if (imgCounter == 1226) {
                            imgCounter = 0
                        }
                        if (imgCounter == 624) {
                            imgCounter = 620
                        }
                        if (imgCounter == 776) {
                            imgCounter = 758
                        }

                    }, 300);

                    //SET A PROPERTIE TO THE BRICK TO STOP IT WHEN THE BALL CRASH THE BRICK
                    bricks[r][c].interval = brickInterval1
                })
            }

        }

        //THOSE COLUMNS WILL BE SHARK BRICK ON THE RIGHT    
        for (let c = brick.column - 1; c >= 10; c--) { //to create the columns
            if (r + c > 11) {
                bricks[r][c] = {
                    x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                    y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                    status: true //that mean that the brick is not destroyed
                }

                if (bricks[r][c].status) {

                    let imgShark = document.createElement('img')
                    imgShark.src = './imgs/shark.png'

                    imgShark.addEventListener('load', function () { //load because we create the image so it will take time to be onload

                        let imgCounter = 0
                        let brickInterval2 = setInterval(() => {

                            //clear drawing area (x,  y, width, height)
                            ctx.clearRect(bricks[r][c].x, bricks[r][c].y, brick.width, brick.height)

                            //draw shark image
                            ctx.drawImage(imgShark, imgCounter, 562, 156, 130, bricks[r][c].x, bricks[r][c].y, brick.width, brick.height)
                            imgCounter += 156

                            if (imgCounter == 624) {
                                imgCounter = 620
                            }
                            if (imgCounter == 776) {
                                imgCounter = 758
                            }

                            //RESTART THE DRAWING PROCESS EHEN WE ARRIVE TO 1226
                            if (imgCounter == 1226) {
                                imgCounter = 0
                            }
                        }, 300);

                        //SET A PROPERTIE TO THE BRICK TO STOP IT WHEN THE BALL CRASH THE BRICK
                        bricks[r][c].interval = brickInterval2
                    })
                }
            }
        }

        //THOSE COLUMNS WILL BE FISH BRICK ON THE LEFT 
        for (let c = 2; c < brick.column - 7; c++) { //to create the columns
            if ((c + r == 3 || c + r == 5) || (c + r == 7 || c + r == 9)) {
                bricks[r][c] = {
                    x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                    y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                    status: true //that mean that the brick is not destroyed
                }

                if (bricks[r][c].status) {
                    let imgFish = document.createElement('img')
                    imgFish.src = './imgs/7outa.png'

                    imgFish.addEventListener('load', function () { //load because we create the image so it will take time to be onload

                        ctx.drawImage(imgFish, bricks[r][c].x, bricks[r][c].y, brick.width, brick.height)

                    })
                }
            }
        }

        //THOSE COLUMNS WILL BE FISH BRICK ON THE RIGHT 
        for (let c = 7; c < brick.column - 2; c++) { //to create the columns
            if ((c + r == 8 || c + r == 10)) {
                bricks[r][c] = {
                    x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                    y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                    status: true //that mean that the brick is not destroyed
                }

                if (bricks[r][c].status) {
                    let imgFish = document.createElement('img')
                    imgFish.src = './imgs/7outa.png'

                    imgFish.addEventListener('load', function () { //load because we create the image so it will take time to be onload

                        ctx.drawImage(imgFish, bricks[r][c].x, bricks[r][c].y, brick.width, brick.height)

                    })
                }
            }
        }

    }
}

//CREATE OF THE OCTOPUS
function createOctopus(ctx) {
    let imgOctopus = document.createElement('img')
    imgOctopus.src = './imgs/oct.png'

    imgOctopus.addEventListener('load', function () { //load because we create the image so it will take time to be onload

        ctx.drawImage(imgOctopus, 285, 80, 100, 100)

    })
}

//CREATE FISH NET
function createNet(ctx, Ximg, Yimg) {
    let imgFishNet = document.createElement('img')
    imgFishNet.src = './imgs/fishnet.png'

    imgFishNet.addEventListener('load', function () {

        ctx.drawImage(imgFishNet, Ximg, Yimg, 250, 180)

    })
}



/////////////////////////////
///     BALLCOLLISIONS     //
/////////////////////////////

//BALL AND WALL DETECTION
function ballWallCollision(ball, ballCanvas, paddle, gameOver1, youLose, loop) {

    //CHECK THE CONTACT OF THE BALL WITH THE RIGHT AND LEFT WALL
    if (ball.x + ball.dx + ball.radius > ballCanvas.width || ball.x + ball.dx - ball.radius < 0) {
        ball.dx = -ball.dx
    }

    //CHECK THE CONTACT OF THE BALL WITH THE TOP WALL
    if (ball.y + ball.dy - ball.radius < 0) {
        ball.dy = -ball.dy
    }

    //CHECK THE CONTACT OF THE BALL WITH THE GROUND AND REDUCE THE NUMBER OF LIVES
    if (ball.y + ball.radius > ballCanvas.height) {
        LIFE--
        life_lost.play()
        //EACH TIME WE RESTART ANOTHER BALL UNTIL THE LIVES ARRIVE TO 0
        resetBall(ball, paddle, ballCanvas)
        if (LIFE <= 0) {
            showYouLose(gameOver1, youLose)
            clearInterval(loop);

            //AFTER 1S SHOW THE SCORE AND THE SAVE PAGE
            setTimeout(() => {
                localStorage.setItem("mostRecentScore", SCORE);
                return window.location.assign('./endPage.html')
            }, 2000);
        }
    }
}

//BALL AND PADDLE DETECTION
function ballPaddleCollision(ball, paddle) {

    //CHECK THE CONTACT OF THE BALL WITH THE PADDLE
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y) { //the ball is inside the paddle

        //CHECK WHERE THE BALL HIT THE PADDLE
        let collidepoint = ball.x - (paddle.x + paddle.width / 2)

        //NORMALIZE THE VALUES
        collidepoint = collidepoint / (paddle.width / 2)

        //CALCULATE THE ANGLE OF THE BALL
        let angle = collidepoint * Math.PI / 3

        ball.dx = ball.speed * Math.sin(angle)
        ball.dy = -ball.speed * Math.cos(angle)

    }
}

//BALL AND BRICKS DETECTION
function ballBricksCollision(context3, brick, bricks, ball, gameOver1, youWon, loop) {

    bricks.forEach((brick1) => {

        //CHECK IF THE ROW IS EMPTY OR NOT
        if (brick1 != "empty") {
            brick1.forEach((item) => {

                //CHECK IF THIS BRICK LOCAL IS EMPTY OR NOT
                if (item != "empty") {
                    if (item.status) {

                        //CHECK THE CONTACT OF THE BALL WITH THE BRICKS FROM THE 4 SIDES
                        if ((ball.x + ball.radius > item.x) && (ball.x - ball.radius < item.x + brick.width) && (ball.y + ball.radius > item.y) && (ball.y - ball.radius < item.y + brick.height)) {
                            //STOP THE SETINTERVAL OF THE BRICK
                            clearInterval(item.interval)

                            //CLEAR THE BRICK LOCAL
                            context3.clearRect(item.x, item.y, brick.width, brick.height)

                            //CHANGE THE STATUS OF THE BRICK TO FALSE THAT MEAN THIS BRICK DOESNT EXIST ON THE CONTEXT
                            item.status = false

                            //GO BACK EIN STEP IF THE BALL DETECTE THE BRICK
                            ball.dy = -ball.dy

                            //ADD 10 TO THE SCORE WE WE CRASH A BRICK WITH THA BALL
                            SCORE += SCORE_ADD
                            brick_hit.play()

                        }
                    }
                }
            })
        }

        //CHECK IF THERE IS NOT ANYMORE A BRICK ON THE CONTEXT, CALL THE END PAGE AND SHOW THE SCORE
        if (SCORE == (bricks.length - 2) * brick1.length * 10) {

            //SET THE LAST SCORE TO THE LOCAL STORAGE TO COMPARE IT WITH THE OTHERS SCORES
            localStorage.setItem('mostRecentScore', SCORE)

            //SHOW A WIN MESSAGE
            showYouWin(gameOver1, youWon)

            //STOP THE GAME
            clearInterval(loop); // Needed for Chrome to end game

            win.play()
            //AFTER 1S SHOW THE SCORE AND THE SAVE PAGE
            setTimeout(() => {
                localStorage.setItem("mostRecentScore", SCORE);
                return window.location.assign('./endPage.html')
            }, 2000);
        }
    });
}



/////////////////////////////
///     RESET THE BALL     //
/////////////////////////////

function resetBall(ball, paddle, ballCanvas) {
    ball.x = ballCanvas.width / 2
    ball.y = paddle.y - ball.radius
    ball.dx = 3 * (Math.random() * 2 - 1)
    ball.dy = -3
}



////////////////////////////
////    SHOW  MESSAGES    //
////////////////////////////
//show the score and life
function showGameStatus(context1, text, textX, textY, image_source, imgX, imgY, imgWidth, imgHeight) {
    
    context1.font = '25px Germania One'
    context1.fillText(text, textX, textY)

}

function showImageStatus(context1, image_source, imgX, imgY, imgWidth, imgHeight) {

    //draw image
    let img2 = document.createElement('img')
    img2.src = image_source

    //create onload events for img to add it inside convas after loading
    img2.addEventListener('load', function () {
        context1.drawImage(img2, imgX, imgY, imgWidth, imgHeight)
    })

}

//SHOW YOU WIN
function showYouWin(gameOver1, youWon) {
    gameOver1.style.display = 'block'
    youWon.style.display = 'block'
}

//SHOW YOU LOSE
function showYouLose(gameOver1, youLose) {
    gameOver1.style.display = 'block'
    youLose.style.display = 'block'
   
}


function plotSine(ctx, x, xOffset, yOffset, width) {
    
    ctx.beginPath();

    var y = 0;
    var amplitude = 5;
    var frequency = 10;
    //x IS THE Xposition
    //yoffset IS THE Ypositon
    //width LENGTH OF THE WAVE
    while (x < width) { 
        y = yOffset + amplitude * Math.sin((x + xOffset) / frequency);
        ctx.lineTo(x, y);
        x++;

    }
    ctx.strokeStyle = "#000099";
    ctx.lineWidth = 7;
    ctx.stroke();

}

function draw(ctx) {

    plotSine(ctx, 285, step, 157, 385);

    step += 1; //speed

}