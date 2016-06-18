/**
 * Created by Yuval on 6/14/2016.
 */
var n = localStorage.getItem('gridSize');
var valArr = null;
var bColor = '#9d9d9d';
var flipped = [];
var currentPlayerIndex = 0;
var states = ['tie', 'win', 'lose'];
var totalFlipped = 0;
var defaultSize = 2;
var linksToPics = {
    'A': 'https://goo.gl/4PB08c',
    'B': 'https://goo.gl/IgvtkN',
    'C': 'https://goo.gl/TWYyLy',
    'D': 'http://goo.gl/TpNZAW',
    'E': 'http://goo.gl/EEDR0N',
    'F': 'http://goo.gl/95j5tp',
    'G': 'http://goo.gl/WDGwYT',
    'H': 'http://goo.gl/mw9LBA',
    'I': 'http://goo.gl/G8R9AI',
    'J': 'http://goo.gl/JjKqGe',
    'K': 'http://goo.gl/Sy7cZq',
    'L': 'http://goo.gl/6zdvXB',
    'M': 'http://goo.gl/WkFsSp',
    'N': 'http://goo.gl/QcGiCC',
    'O': 'http://goo.gl/b8bbZO',
    'P': 'http://goo.gl/UQ6U2K',
    'Q': 'http://goo.gl/qegJJc',
    'R': 'http://goo.gl/AFNGvx',
    'S': 'http://goo.gl/CpSNKh',
    'T': 'http://goo.gl/UdFsSx',
    'U': 'https://goo.gl/33JQXR',
    'V': 'http://goo.gl/lO0XGm',
    'W': 'http://goo.gl/C9gajS',
    'X': 'http://goo.gl/ylhdRD',
    'Y': 'https://goo.gl/7btU4a',
    'Z': 'http://goo.gl/FXMqG0'
}


function Player(name, score, state) {
    this.name = name;
    this.score = score;
    this.state = state;
};


var players = [new Player('Player One', 0, states[0]), new Player('Player Two', 0, states[0])];
var cardFlipCount = 0;

var getCharacter = function () {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return possible.charAt(Math.floor(Math.random() * possible.length));
};

function create2DArray(rows, columns) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
        for (var j = 0; j < columns; j++) {
            arr[i][j] = 0;
        }
    }

    return arr;
};

var twoInArray = function (arr, char) {
    var counter = 0;
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === char) {
                counter++;
            }
        }
    }
    return (counter === 2) ? true : false;
};

var getValues = function () {
    var arr = [];
    while (arr.length < n * n) {
        var randomChar = getCharacter();
        var found = twoInArray(arr, randomChar);

        if (!found) {
            arr.push(randomChar);
            arr.push(randomChar);
        }
    }

    function shuffle(array) {
        var counter = array.length;

        while (counter > 0) {
            var index = Math.floor(Math.random() * counter);
            counter--;
            var temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }

    return shuffle(arr);
};

var populateArray = function (arr, vals) {
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            arr[i][j] = vals.pop();
        }
    }
    return arr;
};


var drawTable = function drawTable(n, m) {
    var t = $(".board");
    for (var i = 0; i < n; i++) {
        var row = $("<tr></tr>");
        $(t).append(row);
        for (var j = 0; j < m; j++) {
            var cell = $("<td class='card'>$</td>");
            $(cell).attr('id', i + ',' + j);
            console.log($(cell).attr('id'), ' : ', valArr[i][j]);
            $(row).append(cell);
        }
    }
};

var flipCard = function () {
    var card = $(this);
    $('.card').prop('disabled',true);
    var coord = getCoordinates($(this).attr('id'));
    flipped.push($(card));
    var showCard = function () {
        cardFlipCount++;
        if (cardFlipCount === 2) {
            cardFlipCount = 0;
            if ($(flipped[0]).html() === $(flipped[1]).html()) {
                correctPair();
            }
            else {
                flipBack();
            }
        }
        $('.card').prop('disabled',false);
    };

    var animationComplete = function () {
        $(card).css('backgroundColor', 'white');
        $(card).html(valArr[coord[0]][coord[1]]);
        $(card).css('background-image', 'url(' + linksToPics[valArr[coord[0]][coord[1]]] + ')');
        $(card).animate({
            opacity: 1,
        }, 500, showCard);

    };

    $(card).animate({
        opacity: 0.3,
    }, 250, animationComplete);
};

var assignCurrentWinner = function () {
    if (players[0].score > players[1].score) {
        players[0].state = states[1];
        players[1].state = states[2];
    } else if (players[0].score < players[1].score) {
        players[0].state = states[2];
        players[1].state = states[1];
    } else {
        players[0].state = states[0];
        players[1].state = states[0];
    }
};

var getWinAnnouncement = function () {
    if (totalFlipped === n * n) {
        var win = '';
        for (var i = 0; i < players.length; i++) {
            if (players[i].state === states[1]) {
                $('#btn-1').css(
                    'visibility', 'visible'
                );
                $('#btn-1').slideDown(500);
                return players[i].name + ' wins with ' + players[i].score + ' points!';
            }
        }

    }
    return 'Match found!';
};

var correctPair = function () {
    players[currentPlayerIndex].score += 10;
    totalFlipped += 2;
    assignCurrentWinner();
    $('.announcement').html(getWinAnnouncement());
    $(".score").html(players[currentPlayerIndex].score);
    flipped = [];
};

var flipBack = function () {
    for (var i = 0; i < flipped.length; i++) {
        $(flipped[i]).html('$');
        $('.board').prop('disabled', false);
        $(flipped[i]).css('background-image', 'url()');
        $(flipped[i]).css('backgroundColor', bColor);
    }
    $('.announcement').html('No match');
    advanceTurn();
    flipped = [];
};

var getCoordinates = function (str) {
    var coord = str.split(',');
    coord[0] = parseInt(coord[0]);
    coord[1] = parseInt(coord[1]);
    return coord;
};

var advanceTurn = function () {
    currentPlayerIndex = (currentPlayerIndex === 0) ? 1 : 0;
    $(".player").html(players[currentPlayerIndex].name);
    $(".score").html(players[currentPlayerIndex].score);
};

var changeDifficulty = function () {
    var dif = parseInt($(this).attr('id').split('-')[1]); // get grid size
    if (dif === 1) {
        dif = n;
    }
    localStorage.setItem('gridSize', dif);
    console.log("DIF = ", dif, ' =?= ', localStorage.getItem('gridSize'));
    var reloadBoard = function () {
        location.reload();
    };
    reloadBoard();
};

var resetBoard = function () {
    $(this).slideUp(500, changeDifficulty);
};

var init = function () {
    if (localStorage.getItem('gridSize') == null) {
        localStorage.setItem('gridSize', defaultSize);
    }
    n = localStorage.getItem('gridSize');
    valArr = populateArray(create2DArray(n, n), getValues());
    drawTable(n, n);
    $('.board').on('click', 'td', flipCard);
    $('.btn-primary').on('click', changeDifficulty);
    $('#btn-1').on('click', resetBoard);

    $(".player").html(players[currentPlayerIndex].name);
    $(".score").html(players[currentPlayerIndex].score);
    $(".announcement").html(players[currentPlayerIndex].name + ' starts!');
    $("#btn-1").slideUp();
};


init();