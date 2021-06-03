const easy = [
    "6-5--9-7---1--5-2---4--1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

let timer;
let timeRemaining;
let lives;
let selectedNum;
let selectedTile;
let disableSelect;

window.onload = function(){
    // startGame();
    let createBtn = document.querySelector('.game__createBtn');
    createBtn.addEventListener('click', startGame);
    let numberDiv = document.querySelector('.game__number');
    for(let i = 0; i < numberDiv.children.length; i++){
        numberDiv.children[i].addEventListener('click', function(){
            // console.log('number is clicked', numberDiv.children[i]);
            if(!disableSelect){
                if(this.classList.contains('selected')){
                    this.classList.remove('selected');
                    selectedNum = null;
                }else {
                    for(let i = 0 ; i < numberDiv.children.length; i++){
                        numberDiv.children[i].classList.remove('selected');
                    }
                    this.classList.add('selected');
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }
    
}
function startGame(){
    //console.log('start game');
    // choose difficulty:
    if(document.querySelector('#game__diffEasy').checked) board = easy[0];
    else if(document.querySelector('#game__diffMedium').checked) board = medium[0];
    else board = hard[0];
    // setting lives:
    lives = 3;
    disableSelect = false;
    document.querySelector('.game__lives').textContent = `Lives remaining ${lives}`;
    console.log(board);
    generateBoard(board);
    startTimer();
    document.querySelector('.game__number').classList.remove('hidden');

}
function generateBoard(board){
    clearPrevious();
    let idCount = 0;
    for(let i = 0; i < 81; i++){
        let tile = document.createElement('p');
        if(board.charAt(i)!== '-'){
            tile.textContent = board.charAt(i);
        }else {
            tile.addEventListener('click', function(){
                if(!disableSelect){
                    if(tile.classList.contains('selected')){
                        tile.classList.remove('selected');
                        selectedTile = null;
                    } else {
                        for(let i = 0; i < 81; i++){
                            document.querySelectorAll('.game__tile')[i].classList.remove('selected');
                        }
                        tile.classList.add('selected');
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }
        tile.id = idCount;
        idCount++;
        tile.classList.add('game__tile');
        if((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)){
            tile.classList.add('bottomBorder');
        }
        if((tile.id + 1) % 9 === 3 || (tile.id + 1) % 9 === 6){
            tile.classList.add('rightBorder');
        }
        document.querySelector('.game__board').appendChild(tile);
    }

}
function updateMove(){
    if(selectedTile && selectedNum){
        selectedTile.textContent = selectedNum.textContent;
        if(checkCorrect(selectedTile)){
            selectedTile.classList.remove('selected');
            selectedNum.classList.remove('selected');
            selectedNum = null;
            selectedTile = null;
            if(checkDone()){
                endGame();
            }
        } else {
            disableSelect = true;
            selectedTile.classList.add('incorrect');
            setTimeout(function(){
                lives--;
                if(lives === 0) endGame();
                else {
                    document.querySelector('.game__lives').textContent = `Lives remaining ${lives}`;
                    disableSelect = false; 
                }
                selectedTile.classList.remove('incorrect');
                selectedTile.classList.remove('selected');
                selectedNum.classList.remove('selected');
                selectedTile.textContent = '';
                selectedTile = null;
                selectedNum = null;
            }, 1000);
        }
    }
}
function checkDone(){
    let tiles = document.querySelectorAll('.game__tile');
    for(let i = 0; i < tiles.length; i++){
        if(tiles[i].textContent === '') return false;
    }
    return true;
}

function endGame(){
    disableSelect = true;
    clearTimeout(timer);
    if(lives === 0 || timeRemaining === 0){
        document.querySelector('.game__lives').textContent = `You lost!!!!`;
    } else {
        document.querySelector('.game__lives').textContent = `You won!!!!`;
    }

}
function checkCorrect(tile){
    let solution;
    if(document.querySelector('#game__diffEasy').checked) solution = easy[1];
    else if(document.querySelector('#game__diffMedium').checked) solution = medium[1];
    else solution = hard[1];
    if(solution.charAt(tile.id) === tile.textContent){
        return true;
    } else return false;
}

function clearPrevious(){
    // clearing tiles
    let tiles = document.querySelectorAll('.game__tile');
    for(let i = 0; i < tiles.length; i++){
        tiles[i].remove();
    }
    // clear timer
    if(timer) clearTimeout(timer);
    // clearing number 
    // let numberDiv = document.querySelector('.game__number');
    // for(let i = 0; i < numberDiv.children.length; i++){
    //     numberDiv.children[i].remove('selected');
    // }
    selectedNum=null;
    selectedTile=null;
}
function startTimer(){
    if(document.querySelector('#game__timeFive').checked)timeRemaining = 300
    else if(document.querySelector('#game__timeTen').checked) timeRemaining = 600;
    else timeRemaining = 900;
    document.querySelector('.game__timer').textContent = timeConversion(timeRemaining);
    timer = setInterval(function(){
        timeRemaining--;
        if(timeRemaining === 0) endGame();
        document.querySelector('.game__timer').textContent = timeConversion(timeRemaining);

    }, 1000)
}

function timeConversion(time){
    // console.log('inside time conversion ', time);
    let minutes = Math.floor(time / 60);
    if(minutes < 10 ) minutes = '0' + minutes;
    let seconds = Math.floor(time % 60);
    if(seconds < 10) seconds = '0' + seconds;
    return minutes + ':' + seconds;
}

