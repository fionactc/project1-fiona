$(document).ready(function(){
  // game board array
  var board = new Array([]);
  var keyCount = 0;

  var object = function(type){
    this.type = type;
    this.y = '';
    this.x = '';
  }

  for (var y=0; y<6; y++){
    board[y]= [];
    for (var x=0; x<6; x++){
      board[y][x] = {key:keyCount, object: {}};
      board[y][x].object = new object('blank');
      keyCount++;
    }
  }

  // Object constructor

  // Object A
  // type, coords

  var place = function($grid, piece){
    piece.y = Number($grid.parent().attr('data-row'));
    piece.x = Number($grid.attr('data-column'));
    $grid.children().addClass(piece.type);
    board[piece.y][piece.x].object = piece;
  }
  var removeObject = function(y,x,type){
    board[y][x].object = {};
    $('[data-row="'+y+'"]').find($('[data-column="'+x+'"]')).find($('div')).removeClass(type);
  }

  var check = function($grid, piece){
    var y = piece.y;
    var x = piece.x;
    var type = piece.type;
    var combo = [];
    // level up type
    var newType = String.fromCharCode(type.charCodeAt(0)+1);
  }

  // CHECK topLeft and topRight
  var checkTopCorner = function(y, x, type){
    var combo = [];
    // top right corner
    if (board[y][x+1].object.type == type&&
        board[y+1][x+1].object.type == type){
      combo.push(board[y][x+1].object,board[y+1][x+1].object);
    }
    if (board[y][x-1].object.type == type &&
        board[y+1][x].object.type == type){
      combo.push(board[y][x-1].object, board[y+1][x].object);
    }
    if (board[y-1][x-1].object.type == type &&
        board[y-1][x].object.type == type){
      combo.push(board[y-1][x-1].object, board[y-1][x].object);
    }

    // top left corner
    if (board[y][x-1].object.type == type &&
        board[y+1][x-1].object.type == type){
      combo.push(board[y][x-1].object, board[y+1][x-1].object);
    }
    if (board[y][x+1].object.type == type &&
        board[y+1][x].object.type == type){
      combo.push(board[y][x+1].object, board[y+1][x].object);
    }
    if (board[y-1][x+1].object.type == type &&
        board[y-1][x].object.type == type){
      combo.push(board[y-1][x+1].object, board[y-1][x].object);
    }
   }

   var checkBotCorner = function(y, x, type){
    var combo = [];
    // bot right corner
    if (board[y+1][x].object.type == type &&
        board[y+1][x-1].object.type == type){
      combo.push(board[y+1][x].object, board[y+1][x-1].object);
    }
    if (board[y-1][x].object.type == type &&
        board[y][x-1].object.type == type){
      combo.push(board[y-1][x].object, board[y][x-1].object);
    }
    if (board[y-1][x+1].object.type == type &&
        board[y][x+1].object.type == type){
      combo.push(board[y-1][x+1].object, board[y][x+1].object);
    }

    // bot left corner
    if (board[y+1][x].object.type == type &&
        board[y+1][x+1].object.type == type){
      combo.push(board[y+1][x].object, board[y+1][x+1].object);
    }
    if (board[y-1][x].object.type == type &&
        board[y][x+1].object.type == type){
      combo.push(board[y-1][x].object, board[y][x+1].object);
    }
    if (board[y-1][x-1].object.type == type &&
        board[y][x-1].object.type == type){
      combo.push(board[y-1][x-1].object, board[y][x-1].object);
    }
   }

   var checkHorizontal = function(y, x, type){
    var combo = [];
    if (board[y][x+1].object.type == type &&
        board[y][x+2].object.type == type){
      combo.push(board[y][x+1].object, board[y][x+2].object);
      if (board[y][x-1].object.type == type){
        combo.push(board[y][x-1].object);
      }
    }
   }


  // Object enemy

  // function to randomize next object
  var randomObject = function(){
    var ran = Math.random()*100;
    if (ran<5){
      return new object('crystal');
    } else if (ran>=5&&ran<10){
      return new object('remove');
    } else if (ran>=10&&ran<20){
      return new object('b');
    } else if (ran>=20&&ran<40){
      return new object('enemy');
    } else {
      return new object('a');
    }
  }

  // reset game board
  var reset = function(){

  }
  // function to detect player's move
  var playerMove = function(e){
    var $grid = $(e.target);
    var piece = new object('a');

    place($grid, piece);
    console.log(piece.y + piece.x);
    console.log(board[piece.y][piece.x]);
    console.log(board);
    check($grid, piece);
  }

  // initialization
  var init = function(){
    $('tr').on('click', playerMove);
  }
  init();
})