$(document).ready(function(){
  var coordsToRemove = [];

  var chessPiece = function(type, y, x){
    this.type = type;
    this.y = y === undefined ? '' : y;
    this.x = x === undefined ? '' : x;

    // for debugging
    this.test = function(){
      console.log('type is ' + this.type);
      console.log('y is ' + this.y);
      console.log(board[this.y][this.x]);
    }

    this.removeSameType = function () {
      coordsToRemove.forEach(function(coord){
        var y = coord[0];
        var x = coord[1];
        board[y][x].type = "blank";
        // css
      });
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
        if (totalCounter >= 2) { // 2 because excluding self
          console.log("triple")
          this.removeSameType();
          // upgrade()
        } else {
          coordsToRemove = [];
        }
      }
    }

    this.destructPiece = function ($grid){
      $grid.removeClass();
      board[this.y][this.x].type = 'blank';
    }
  }

  // |||||||||||||||||||||||||||||||||||||
  // |||||||||GAME BOARD OBJECT ||||||||||
  // |||||||||||||||||||||||||||||||||||||

  var board = [];
  for (var y=0; y<6; y++){ // initialize board array
    board[y]= [];
    for (var x=0; x<6; x++){
      board[y][x] = new chessPiece('blank', y, x);
    }
  }

  var gameBoard = function(){
    var that = this;
    var score = 0;
    var keyCount = 0;
    var nextPieceType = null;

    this.randomPiece = function(){
      var ran = Math.random()*100;
      if (ran<5){
        nextPieceType = 'crystal';
      } else if (ran>=5&&ran<10){
        nextPieceType = 'destruct';
      } else if (ran>=10&&ran<20){
        nextPieceType = 'b';
      } else if (ran>=20&&ran<40){
        nextPieceType = 'enemy';
      } else {
        nextPieceType = 'a'
      }
      $('#next').find($('span')).removeClass().addClass(nextPieceType);
      $('#next').addClass('a-info');
    }

    this.placeChessPiece = function(e){
      var $grid = $(e.target);
      var gridHasClass = !!$grid.attr("class");

      if (gridHasClass) {
        console.log("ocupied")
      } else {
        var row = $grid.data('row');
        var col = $grid.data('column');
        var targetPiece = board[row][col];

        targetPiece.type = nextPieceType;

        $grid.attr("class", "");
        $grid.children().addClass(nextPieceType);
        // if (nextPieceType === 'destruct'){
        // } else if (nextPieceType === 'a'){
        // } else if (nextPieceType === 'b'){
        // }
        // execute when destruct
        // execute when NOT DESTRUCT

        switch (nextPieceType){
          case 'a': case 'b':
            targetPiece.checkNeighbours();
            break;
          // case 'destruct':
          //   nextPiece.destructPiece($grid);
          //   break;
        }
      }
    }

    this.click = function(e){
      that.placeChessPiece(e);
      that.randomPiece();
    }

    // run on instantiate
    this.randomPiece();
  } // end of gameBoard

  var init = function(){
    var game = new gameBoard();
    $('#gameboard').find($('tr')).on('click', 'td', game.click);
  }
  init();

  window.board = board;
  window.coordsToRemove = coordsToRemove;
})
