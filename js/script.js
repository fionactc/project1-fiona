$(document).ready(function(){
  // game board array
  var board = [];
  var keyCount = 0;
  for (var y=0; y<6; y++){
    board[y]= [];
    for (var x=0; x<6; x++){
      board[y][x] = {key:keyCount, object:{}};
      keyCount++;
    }
  }

  // Object constructor

  // Object A
  // type, coords
  var object = function(type){
    this.type = type;
    this.y = '';
    this.x = '';
  }

  var place = function($grid, piece){
    piece.y = $grid.parent().attr('data-row');
    piece.x = $grid.attr('data-column');
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
    // level up type
    var newType = String.fromCharCode(type.charCodeAt(0)+1);

    if (board[y-1][x-1].object.type == type){
      if (board[y-1][x].object.type == type){
        removeObject(y-1, x-1, type);
        removeObject(y-1, x, type);
        place($grid, new object(newType));

      } else if (board[y][x-1].object.type == type){
        removeObject(y-1, x-1, type);
        removeObject(y, x-1, type);
        place($grid, new object(newType));
      }
    }

    if (board[y-1][x+1].object.type == type){
      if (board[y-1][x].object.type == type){
        removeObject(y-1, x+1, type);
        removeObject(y-1, x, type);
        place($grid, new object(newType));
      } else if (board[y][x+1].object.type == type){
        removeObject(y-1, x+1, type);
        removeObject(y, x+1, type);
        place($grid, new object(newType));
      }
    }

    if (board[y+1][x+1].object.type == type){

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
    var piece = randomObject();

    console.log(piece);
    console.log(piece.y + piece.x);
    place($grid, piece);
    check($grid, piece);
  }

  // initialization
  var init = function(){
    $('tr').on('click', playerMove);
  }
  init();
})