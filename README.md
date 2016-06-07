# project1-fiona

<HTML>
1. Setup HTML
2. Link css and js to html
3. Link bootstrap to html
4. Set up 6x6 grid

<JS>
1. Gameboard
  1.1. 6x6 array
  1.2. click event
2. Game items - create object constructor
  2.1. a, b, c -> link 3 into one higher level object
  2.2. enemies -> move one space everytime when player place one item
  2.3. crystals -> combine 2 same items into 1 higher level object
  2.4. remove -> remove one item in the clicked location
3. Randomize object to be placed
  3.1. attach to cursor
4. Player's move - initiate by click event
  4.1. Create new object
  4.2. place object to the clicked location
    4.2.1. if item a/b/c => check if there are two more items around
    4.2.2. if enemies => place enemy and move it one grid
    4.2.3. if crystal => upgrade 2 items
    4.2.4. if remove => remove one item
    4.2.5. if place at [0,0] =>
      4.2.5.1. if empty => place it there and move to next item
      4.2.5.2. if not empty => switch
  4.3. If no more available place => end game
  4.4. Move all enemies one grid
  4.5. Update score (with animation)
5. Game instructions

