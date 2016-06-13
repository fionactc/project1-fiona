$(document).ready(function(){
  var coordsToRemove = [];

  var chessPiece = function(type, y, x){
    this.type = type;
    this.y = y === undefined ? '' : y;
    this.x = x === undefined ? '' : x;
    var wildCardType = 'crystal';

    this.removeSameType = function () {
      coordsToRemove.forEach(function(coord){
        var y = coord[0];
        var x = coord[1];
        board[y][x].type = "blank";
        // css
        $('[data-row="' + y + '"][data-column="' + x + '"]').find($('div')).removeClass();
      });
    }
    this.upgradePiece = function(type){
      var newType = String.fromCharCode(type.charCodeAt(0)+1);
      wildCardType = newType;
      $('[data-row="' + this.y + '"][data-column="' + this.x + '"]').find($('div')).attr("class", newType);
      board[this.y][this.x].type = newType;
      // game.updateScore(newType);
      board[this.y][this.x].checkNeighbours();
    }

    this.checkNeighbours = function (fromDirection, checkType){
      fromDirection   = fromDirection || 'base';
      checkType       = checkType || this.type; // "a"
      var    selfType = this.type;
      var    y = this.y;
      var    x = this.x;

      // Recursion Break Condition
      if (checkType != selfType) { return 0; }

      var topCounter, leftCounter, botCounter, rightCounter;
      topCounter = leftCounter = botCounter = rightCounter = 0;

      var topCondition   = fromDirection !== "top" && y - 1 >= 0;
      var leftCondition  = fromDirection !== "left" &&  x -1 >= 0;
      var botCondition   = fromDirection !== "bottom" && y + 1 <= 5;
      var rightCondition = fromDirection !== "right" && x + 1 <= 5;

      topCounter   += topCondition   ? board[y-1][x].checkNeighbours("bottom", checkType) : 0;
      leftCounter  += leftCondition  ? board[y][x-1].checkNeighbours("right", checkType)  : 0;
      botCounter   += botCondition   ? board[y+1][x].checkNeighbours("top", checkType)    : 0;
      rightCounter += rightCondition ? board[y][x+1].checkNeighbours("left", checkType)   : 0;

      var totalCounter = topCounter + leftCounter + botCounter + rightCounter;

      if (fromDirection !== 'base') {
        coordsToRemove.push([y,x]);
        return 1 + totalCounter;
      } else {
        console.log(totalCounter);
        if (totalCounter >= 2) {
          console.log("triple")
          this.removeSameType();
          // upgrade()
          this.upgradePiece(checkType);
        } else {
          coordsToRemove = [];
        }
      }
    }

    this.wildCard = function(){
      this.type = 'a';
      this.checkNeighbours();
      this.type = 'b';
      this.checkNeighbours();
      this.type = 'c';
      this.checkNeighbours();
      this.type = 'd';
      this.checkNeighbours();
      this.type = 'e';
      this.checkNeighbours();
      this.type = wildCardType;
    }

  }

  // |||||||||||||||||||||||||||||||||||||
  // |||||||||GAME BOARD OBJECT ||||||||||
  // |||||||||||||||||||||||||||||||||||||

  var board = []; // initialize board array
  for (var y=0; y<6; y++){
    board[y]= [];
    for (var x=0; x<6; x++){
      board[y][x] = new chessPiece('blank', y, x);

    }
  }

  var gameBoard = function(){
    // global variable
    var that = this;
    var score = 0;
    $('#score').html('SCORE: ' + score);
    var occupiedGrid = 0;
    var nextPieceType = null;
    var aliens = [];

    // utility function
    this.generateObstacles = function(){
      var noOfObstacles = 10;
      for (var i = 0; i<noOfObstacles; i++){
        var y = Math.floor(Math.random()*6);
        var x = Math.floor(Math.random()*6);
        board[y][x].type = 'obstacle';
        $('[data-row="' + y + '"][data-column="' + x + '"]').find($('div')).attr("class", 'obstacle');
      }
    }

    this.randomPiece = function(){
      var ran = Math.random()*100;
      if (ran<5){
        nextPieceType = 'crystal';
      } else if (ran>=5&&ran<10){
        nextPieceType = 'destruct';
      } else if (ran>=10&&ran<20){
        nextPieceType = 'b';
      } else if (ran>=20&&ran<30){
        nextPieceType = 'enemy';
      } else {
        nextPieceType = 'a'
      }
      $('#next').find($('span')).removeClass().addClass(nextPieceType);
      $('#next').removeClass().addClass(nextPieceType + '-info');
    }

    this.scanForAliens = function(){
      aliens = [];
      for (var y=0; y<6; y++){
        for (var x=0; x<6; x++){
          if(board[y][x].type=='enemy'){
            aliens.push([y, x]);
          }
        }
      }
    }

    this.alienNextMovement = function(){

      for (var i=0; i<aliens.length; i++){
        var newPosition = [];
        var a = aliens[i][0]; // y coords
        var b = aliens[i][1]; // x coords
        // move right
        if (b!=5){
          if (board[a][b+1].type == 'blank'){
            newPosition=[a, b+1];
          }
        }
        // move top
        if (a!=0){
          if (board[a-1][b].type == 'blank'){
            newPosition = [a-1, b];
          }
        }
        // move left
        if (b!=0){
          if (board[a][b-1].type == 'blank'){
            newPosition = [a, b-1];
          }
        }
        // move bottom
        if (a!=5){
          if (board[a+1][b].type == 'blank'){
            newPosition = [a+1, b];
          }
        }
        if (newPosition.length == 2){
          board[a][b].type = 'blank'
          $('[data-row="' + a + '"][data-column="' + b + '"]').find($('div')).removeClass();
          board[newPosition[0]][newPosition[1]].type = 'enemy';
            $('[data-row="' + newPosition[0] + '"][data-column="' + newPosition[1] + '"]').find($('div')).attr('class', 'enemy');
        }
      }
    }

    this.turnToStone = function(){
      for (var y=0; y<6; y++){
        for (var x=0; x<6; x++){
          if(board[y][x].type=='crystal'){
            board[y][x].type = 'obstacle';
            $('[data-row="' + y + '"][data-column="' + x + '"]').find($('div')).attr('class', 'obstacle');
          }
        }
      }
    }

    this.updateScore = function(type){
      switch (type){
        case 'a':
          score += 100;
          break;
        case 'b':
          score += 200;
          break;
        case 'c':
          score += 300;
          break;
        case 'd':
          score += 400;
          break;
        case 'e':
          score += 400;
          break;
        default:
          score += 0;
      }
      $('#score').html('SCORE: ' + score);
    }

    this.checkOccupiedGrid = function(){
      var existingPiece = 0;
      for (var y=0; y<6; y++){
        for (var x=0; x<6; x++){
          if(board[y][x].type!='blank'){
            existingPiece++;
          }
        }
      }
      occupiedGrid = existingPiece;
    }

    this.gameOver = function(){
      $('#finalScore').html("Your score is " + score);
      $('#gameOverModal').modal('show');
      // $('#gameOverModal').show();
    }
    this.reset = function(){
      for (var y=0; y<6; y++){
        for (var x=0; x<6; x++){
          board[y][x] = new chessPiece('blank', y, x);
          $('[data-row="' + y + '"][data-column="' + x + '"]').find($('div')).removeClass();
        }
      }
      score = 0;
      $('#score').html('SCORE: ' + score);
      occupiedGrid = 0;
      that.generateObstacles();
      that.randomPiece();
      $('#gameOverModal').modal('hide');
    }

    // main game play
    this.placeChessPiece = function(e){
      var $grid = $(e.target);
      var targetPiece = null;
      if (nextPieceType=='destruct'){
        var row = $grid.parent().data('row');
        var col = $grid.parent().data('column');
      } else {
        var row = $grid.data('row');
        var col = $grid.data('column');
      }

      targetPiece = board[row][col];

      targetPiece.type = nextPieceType;

      $grid.attr("class", "");
      $grid.children().addClass(nextPieceType);
      this.updateScore(nextPieceType);


      switch (nextPieceType){
        case 'a': case 'b':
          targetPiece.checkNeighbours();
          break;
        case 'crystal':
          targetPiece.wildCard();
          break;

      }
      console.log(aliens);
      that.checkOccupiedGrid();

      if (occupiedGrid==36){
        that.gameOver();
        // that.reset();
      }
    }

    this.click = function(e){
      var $grid = $(e.target);
      var gridHasClass = !!$grid.attr("class");
      if (!gridHasClass||nextPieceType == 'destruct'){
        that.placeChessPiece(e);
        that.turnToStone();
        that.randomPiece();
        setTimeout(function(){
          that.scanForAliens();
          that.alienNextMovement();

        }, 2000);
      }
    }

    // run on instantiate
    this.generateObstacles();
    this.randomPiece();
  } // end of gameBoard

  var init = function(){
    var game = new gameBoard();
    $('#gameboard').find($('tr')).on('click', 'td', game.click);

    $('.reset').on('click', game.reset);
  }
  var human = $('#human');
  function animation(){
    human.animate({top:'+=20'}, 1000);
    human.animate({top:'-=20'}, 1000, animation);
  }

  init();
  animation();

  window.board = board;
  window.coordsToRemove = coordsToRemove;
})
