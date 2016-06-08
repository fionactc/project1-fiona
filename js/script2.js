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
    var nextPiece = new chessPiece();
    var board = [];
    for (var y=0; y<6; y++){ // initialize board array
      board[y]= [];
      for (var x=0; x<6; x++){
        board[y][x] = {key:keyCount, object: {}};
        board[y][x].object = new chessPiece();
        board[y][x].object.setType('blank');
        keyCount++;
      }
    }

    this.getBoard = function () {
      return board;
    }

    // Upgrade conditions
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

    // Random a piece
    // set it to global var nextPiece
    // print img on screen to show next piece
    this.randomPiece = function(){
      var ran = Math.random()*100;
      if (ran<5){
        nextPiece.setType('crystal');
      } else if (ran>=5&&ran<10){
        nextPiece.setType('remove');
      } else if (ran>=10&&ran<20){
        nextPiece.setType('b');
      } else if (ran>=20&&ran<40){
        nextPiece.setType('enemy');
      } else {
        nextPiece.setType('a');
      }
      $('#next').find($('span')).removeClass().addClass(nextPiece.getType());
    } // End of randomPiece

    this.place = function(e){
      // get the type of nextPiece
      var type = nextPiece.getType();
      // get the clicked grid
      var $grid = $(e.target);
      // get the x and y coords of clicked grid, convert to num
      var y = Number($grid.parent().attr('data-row'));
      var x = Number($grid.attr('data-column'));
      // clear the class in that grid html
      $grid.children().removeClass();
      // add corresponding class in the grid html
      $grid.children().addClass(type);
      // place the piece into board array
      board[y][x].object = nextPiece;

      // call corresponding function to handle chess piece
      switch (type){
        // for regular chess pieces
        case 'a': case 'b': case 'c': case 'd': case 'e':
          that.check($grid, type, y, x);
          break;
        // for 'remove'
        case 'remove':
          that.removePiece($grid, type, y, x);
          break;
      }
      // back to playerMove to generate the next chess piece
      that.playerMove();
    }

    this.upgradePiece = function($grid, y, x, combo, type){
      // find out the type of chess piece one level higher
      var newType = String.fromCharCode(type.charCodeAt(0)+1);
      // dummy var to store new piece
      var newPiece = new chessPiece();
      // set the dummy var's type
      newPiece.setType(newType);

      // reset the type to blank at upgradable coords
      for (var i=0; i<combo.length; i++){
        var a = combo[i][0]; // y coods
        var b = combo[i][1]; // x coods
        // set type to blank
        board[a][b].object.setType('blank');
        // clear the html class at corresponding grids
        $('[data-row="'+a+'"]').find($('[data-column="'+b+'"]')).find($('div')).removeClass(type);
      }
        // place the higher level piece at the clicked grid
        $grid.children().removeClass();
        $grid.children().addClass(newType);
        board[y][x].object = newPiece;
    }

    this.removePiece = function($grid, y, x){
      $grid.children().removeClass();
      board[y][x].object.setType('blank');
    }

    // check if regular chess pieces could be upgraded
    this.check = function($grid, type, y, x){
      // array to store upgradable chess pieces's coords
      var combo = [];
      // conditions, push upgradable coords to combo array
      that.checkTopCorner(y, x, type, combo);

      that.checkBotCorner(y, x, type, combo);
      that.checkVertical(y, x, type, combo);
      that.checkHorizontal(y, x, type, combo);
      // if there are upgradable coods
      if (combo.length>0){
        if (combo[0]!=undefined){
        // UPGRADE
          that.upgradePiece($grid, y, x, combo, type);
        }
      }
      // return to place() after checking and upgrading
    }

    this.playerMove = function(){
      that.randomPiece();
      $('#next').find($('span')).removeClass().addClass(nextPiece.getType());
    }

    this.click = function(e){
      that.place(e);
      that.playerMove();
    }
  } // End of game board

  var init = function(){
    var game = new gameBoard();
    window.debug = game;
    game.randomPiece();
    $('#gameboard').find($('tr')).on('click', game.click);
  }

  init();
// End of script
})