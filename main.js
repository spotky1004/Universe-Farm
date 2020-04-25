$(function (){
  notationForm = 0;
  screenWidthBef = 0;
  screenHeightBef = 0;
  mapNow = 0;
  gateReady = 0;
  gateKey = [0, 0, 0, 0];

  function notation(num) {
    if (notationForm == 0) {
      if (num <= 1) {
        return num.toFixed(3);
      } else {
        notationLevel = Math.floor(Math.log10(num)/3);
        notationSpace = Math.floor(Math.log10(num)%3);
        notationFixed = (num / 1000 ** notationLevel).toFixed(3 - notationSpace) ;
        if (notationLevel < 11) {
          return notationFixed + ' ' + standardNotation[notationLevel];
        } else {
          return notationFixed + ' ' + standardNotation2[(notationLevel-11) % 10] + standardNotation3[Math.floor((notationLevel-11) / 10)];
        }
      }
    } else {
      if (num >= 1e5) {
        return (num/(10**(Math.floor(Math.log10(num))))).toFixed(3) + 'e' + Math.floor(Math.log10(num));
      } else {
        return num.toFixed(2);
      }
    }
  }
  function displayMap() {
    screenWidth = $(window).width();
    screenHeight = $(window).height();
    changed = 0;
    if (screenWidth >= screenHeight && screenWidthBef != screenWidth) {
      blankSpace = (screenWidth-screenHeight)/2-0.5;
      $('#farm').css('left', blankSpace + 'px');
      $('#farm').css('top','5vh');
      $('#farm').css('width','90vh');
      $('#farm').css('height','90vh');
      changed++;
    } else if (screenHeightBef != screenHeight) {
      blankSpace = (screenHeight-screenWidth)/2-0.5;
      $('#farm').css('left','5vw');
      $('#farm').css('top', blankSpace + 'px');
      $('#farm').css('width', '90vw');
      $('#farm').css('height', '90vw');
      changed++;
    }
    if (changed == 1) {
      for (var i = 1; i < 11; i++) {
        for (var j = 1; j < 10; j++) {
          for (var k = 0; k < 3; k++) {
            $('#l' + i + 'C' + j + 'Z' + k).css('left', (11.1111*(j-1)) + '%');
          }
        }
      }
    }
    screenWidthBef = screenWidth;
    screenHeightBef = screenHeight;
    for (var i = 1; i < 10; i++) {
      for (var j = 1; j < 10; j++) {
        for (var k = 0; k < 3; k++) {
          if (i == 1 || j == 1 || i == 9 || j == 9) {
            tileName = 'Resource/Background/block.png';
          } else {
            if (k == 0) {
              tileName = tileImageBackground[maps[mapNow][(i-2)*7+j-2]];
            } else if (k == 1) {
              tileName = tileImageTile[tiles[mapNow][(i-2)*7+j-2]];
            } else if (k == 2) {
              tileName = tileImageThing[things[mapNow][(i-2)*7+j-2]];
            }
          }
          $('#l' + i + 'C' + j + 'Z' + k).css('background-image', 'url(' + tileName + ')');
        }
      }
    }
    if (maps[mapNow][3] == 1 && mapNow == 0 && gateReady == 1) {
      if (gateKey[0] == 1) {
        $('#l1C5Z2').css('background-image', 'url(Resource/Portal/1O.png)');
      } else {
        $('#l1C5Z2').css('background-image', 'url(Resource/Portal/1C.png)');
      }
    }
    if (maps[mapNow][21] == 1 && mapNow == 0 && gateReady == 1) {
      if (gateKey[1] == 1) {
        $('#l5C1Z2').css('background-image', 'url(Resource/Portal/2O.png)');
      } else {
        $('#l5C1Z2').css('background-image', 'url(Resource/Portal/2C.png)');
      }
    }
    if (maps[mapNow][27] == 1 && mapNow == 0 && gateReady == 1) {
      if (gateKey[2] == 1) {
        $('#l5C9Z2').css('background-image', 'url(Resource/Portal/3O.png)');
      } else {
        $('#l5C9Z2').css('background-image', 'url(Resource/Portal/3C.png)');
      }
    }
    if (maps[mapNow][45] == 1 && mapNow == 0 && gateReady == 1) {
      if (gateKey[3] == 1) {
        $('#l9C5Z2').css('background-image', 'url(Resource/Portal/4O.png)');
      } else {
        $('#l9C5Z2').css('background-image', 'url(Resource/Portal/4C.png)');
      }
    }
  }

  setInterval( function (){
    displayMap();
  }, 1000);

  for (var i = 1; i < 10; i++) {
    for (var j = 1; j < 10; j++) {
      for (var k = 0; k < 3; k++) {
        eleId = 'l' + i + 'C' + j + 'Z' + k;
        if (k == 0) {
          classToAdd = 'farmBackground';
        } else if (k == 1) {
          classToAdd = 'farmTile';
        } else if (k == 2) {
          classToAdd = 'farmThing';
        }
        if (k != 2) {
          $('<div id=' + eleId + '>').addClass(classToAdd).addClass('farmBlock').appendTo('#l' + i);
        } else {
          $('<div id=' + eleId + '>').addClass(classToAdd).addClass('farmBlock').addClass('canFarm').appendTo('#l' + i);
        }
      }
    }
  }
  displayMap();
});
