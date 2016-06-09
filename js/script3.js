$(document).ready(function(){
  var coordsToRemove = [];

  var chessPiece = function(type, y, x){
    this.type = type;
    this.y = y === undefined ? '' : y;
    this.x = x === undefined ? '' : x;
    var wildCardType = null;

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
        $('[data-row="' + y + '"][data-column="' + x + '"]').find($('div')).removeClass();
      });
    }
    this.upgradePiece = function(type){
      var newType = String.fromCharCode(type.charCodeAt(0)+1);
      wildCardType = newType;
      $('[data-row="' + this.y + '"][data-column="' + this.x + '"]').find($('div')).attr("class", newType);
      board[this.y][this.x].type = newType;
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
    var that = this;
    var score = 0;
    var keyCount = 0;
    var nextPieceType = null;

    this.generateObstacles = function(){
      var noOfObstacles = 4;
      for (var i = 0; i<4; i++){
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


      switch (nextPieceType){
        case 'a': case 'b':
          targetPiece.checkNeighbours();
          break;
        case 'crystal':
          targetPiece.wildCard();

      }
    }

    this.click = function(e){
      var $grid = $(e.target);
      var gridHasClass = !!$grid.attr("class");
      if (!gridHasClass||nextPieceType == 'destruct'){
        that.placeChessPiece(e);
        that.randomPiece();
      }
    }

    // run on instantiate
    this.generateObstacles();
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
