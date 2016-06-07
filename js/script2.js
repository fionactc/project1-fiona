$(document).ready(function(){
  // |||||| CHESS PIECE OBJECT||||||
  var chessPiece = function(){
    var type = '';
    this.setType = function(t){
      this.type = t;
    }
    this.getType = function(){
      return this.type;
    }
  }

  // |||||||||||||||||||||||||||||||||||||
  // |||||||||GAME BOARD OBJECT ||||||||||
  // |||||||||||||||||||||||||||||||||||||
  var gameBoard = function(){

    var that = this;
    var keyCount = 0;
    var board = new Array([]);
    for (var y=0; y<6; y++){ // initialize board array
      board[y]= [];
      for (var x=0; x<6; x++){
        board[y][x] = {key:keyCount, object: {}};
        board[y][x].object = new chessPiece();
        board[y][x].object.setType('blank');
        keyCount++;
      }
    }


    this.checkTopCorner = function(y, x, type, combo){
      // top right corner
      if (x!=5&&y!=5){
        if (board[y][x+1].object.getType() == type&&
            board[y+1][x+1].object.getType() == type){
          combo.push([y, x+1], [y+1, x+1]);
        }
      }
      if (x!=0&&y!=5){
        if (board[y][x-1].object.getType() == type &&
            board[y+1][x].object.getType() == type){
          combo.push([y, x-1], [y+1, x]);
        }
      }
      if (x!=0&&y!=0){
        if (board[y-1][x-1].object.getType() == type &&
            board[y-1][x].object.getType() == type){
          combo.push([y-1, x-1], [y-1, x]);
        }
      }

      // top left corner
      if (x!=0&&y!=5){
        if (board[y][x-1].object.getType() == type &&
            board[y+1][x-1].object.getType() == type){
          combo.push([y, x-1], [y+1, x-1]);
        }
      }
      if (x!=5&&y!=0){
        if (board[y][x+1].object.getType() == type &&
            board[y+1][x].object.getType() == type){
          combo.push([y, x+1], [y+1, x]);
        }
      }

      if (x!=5&&y!=0){
        if (board[y-1][x+1].object.getType() == type &&
            board[y-1][x].object.getType() == type){
          combo.push([y-1, x+1], [y-1, x]);
        }
      }
    }

    this.checkBotCorner = function(y, x, type, combo){
      // bot right corner
      if (x!=0&&y!=5){
        if (board[y+1][x].object.getType() == type &&
            board[y+1][x-1].object.getType() == type){
          combo.push([y+1, x], [y+1, x-1]);
        }
      }
      if (x!=0&&y!=0){
        if (board[y-1][x].object.getType() == type &&
            board[y][x-1].object.getType() == type){
          combo.push([y-1, x], [y, x-1]);
        }
      }
      if (x!=5&&y!=0){
        if (board[y-1][x+1].object.getType() == type &&
            board[y][x+1].object.getType() == type){
          combo.push([y-1, x+1], [y, x+1]);
        }
      }
      // bot left corner
      if (x!=5&&y!=5){
        if (board[y+1][x].object.getType() == type &&
            board[y+1][x+1].object.getType() == type){
          combo.push([y+1, x], [y+1, x+1]);
        }
      }
      if (x!=5&&y!=0){
        if (board[y-1][x].object.getType() == type &&
            board[y][x+1].object.getType() == type){
          combo.push([y-1, x], [y, x+1]);
        }
      }
      if (x!=0&&y!=0){
        if (board[y-1][x-1].object.getType() == type &&
            board[y][x-1].object.getType() == type){
          combo.push([y-1, x-1], [y, x-1]);
        }
      }
    }

    this.checkHorizontal = function(y, x, type, combo){
      // check right side of piece
      if (x<4){
        if (board[y][x+1].object.getType() == type){
          if (board[y][x+2].object.getType() == type){
            combo.push([y, x+1], [y, x+2]);
            if (x!=0) {
              if (board[y][x-1].object.getType() == type){
                combo.push([y, x-1]);
              }
            }
          }
        }
      }

      // check left side of piece
      if (x>1){
        if (board[y][x-1].object.getType() == type){
          if (board[y][x-2].object.getType() == type){
            combo.push([y, x-1], [y, x-2]);
            if (x!=5){
              if (board[y][x+1].object.getType() == type){
                combo.push([y, x+1]);
              }
            }
          }
        }
      }

      // check both side of piece
      if (x!=5 && x!=0){
        if (board[y][x-1].object.getType() == type &&
            board[y][x+1].object.getType()){
          combo.push([y, x-1][y, x+1]);
        }
      }
    }

    this.checkVertical = function(y, x, type, combo){
      if (y<4){
        if (board[y+1][x].object.getType() == type){
          if (board[y+2][x].object.getType() == type){
            combo.push([y+1, x], [y+2, x]);
            if (y!=0){
              if (board[y-1][x].object.getType() == type){
                combo.push([y-1, x]);
              }
            }
          }
        }
      }
      if (y>1){
        if (board[y-1][x].object.getType() == type){
          if (board[y-2][x].object.getType() == type){
            combo.push([y-1, x], [y-2, x]);
            if (y!=5){
              if (board[y+1][x].object.getType() == type){
                combo.push([y+1, x]);
              }
            }
          }
        }
      }

      if (y!=5&&y!=0){
        if (board[y-1][x].object.getType() == type &&
            board[y+1][x].object.getType() == type){
          combo.push([y-1, x], [y+1, x]);
        }
      }
    }

    this.randomPiece = function(){
      var newPiece = new chessPiece();
      var ran = Math.random()*100;
      if (ran<5){
        newPiece.setType('crystal');
      } else if (ran>=5&&ran<10){
        newPiece.setType('remove');
      } else if (ran>=10&&ran<20){
        newPiece.setType('b');
      } else if (ran>=20&&ran<40){
        newPiece.setType('enemy');
      } else {
        newPiece.setType('a');
      }
      return newPiece;
    } // End of randomPiece

    this.place = function($grid, piece, y, x){
      $grid.children().removeClass();
      $grid.children().addClass(piece.getType());
      board[y][x].object = piece;
      // CHECK
      that.check($grid, piece, y, x);
    }

    this.upgradePiece = function($grid, piece, y, x, combo, type){
      var newType = String.fromCharCode(type.charCodeAt(0)+1);
      var newPiece = new chessPiece();
      newPiece.setType(newType);
      for (var i=0; i<combo.length; i++){
        // remove
        var a = combo[i][0];
        var b = combo[i][1];
        board[a][b].object.setType('blank');
        $('[data-row="'+a+'"]').find($('[data-column="'+b+'"]')).find($('div')).removeClass(type);
      }
        // PLACE
      that.place($grid, newPiece, y, x);
    }

    this.check = function($grid, piece, y, x){
      var combo = [];
      var type = piece.getType();
      that.checkTopCorner(y, x, type, combo);
      that.checkBotCorner(y, x, type, combo);
      that.checkVertical(y, x, type, combo);
      that.checkHorizontal(y, x, type, combo);
      if (combo.length>0){
        if (combo[0]!=undefined){
        // UPGRADE
          that.upgradePiece($grid, piece, y, x, combo, type);
        }
      }
    }

    this.playerMove = function(e){
      var $grid = $(e.target);
      var piece = new chessPiece();
      piece.setType('a');
      // var piece = that.randomPiece();
      var y = Number($grid.parent().attr('data-row'));
      var x = Number($grid.attr('data-column'));
      var type = piece.getType();
      that.place($grid, piece, y, x);
    }
  } // End of game board

  var init = function(){
    var game = new gameBoard();
    $('tr').on('click', game.playerMove);
  }

  init();
// End of script
})