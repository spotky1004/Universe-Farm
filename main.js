$(function (){
  notationForm = 0;
  screenWidthBef = 0;
  screenHeightBef = 0;
  coin = 50;
  dia = 0;
  level = 1;
  exp = 0;
  expNeed = 10;
  mapNow = 0;
  toolSel = 0;
  shopPage = 0;
  handType = 0;
  handSel = 0;
  opening = 0;
  pondCount = [0, 0, 0, 0, 0, 0];
  gateKey = [0, 0, 0, 0, 0, 0];

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
  function timeNotation(num) {
    if (num > 86400000) {
      return (num/86400000).toFixed(4) + ' D';
    } else if (num > 3600000) {
      return (num/3600000).toFixed(3) + ' h';
    } else if (num > 60000) {
      return (num/60000).toFixed(2) + ' m';
    } else {
      return (num/1000).toFixed(1) + ' s';
    }
  }
  function gameSave() {
    var date = new Date();
    date.setDate(date.getDate() + 2000);
    var willCookie = "";
    willCookie += "saveData=";
    saveFile = {};
    for (var i = 0; i < varData.length; i++) {
      saveFile[i] = eval(varData[i]);
    }
    willCookie += JSON.stringify(saveFile);
    willCookie += ";expires=" + date.toUTCString();
    document.cookie = willCookie;
  }
  function gameLoad() {
    var cookies = document.cookie.split(";");
    for(var i in cookies) {
      if(cookies[i].search('saveData') != -1) {
        const savedFile = JSON.parse(decodeURIComponent(cookies[i].replace('saveData' + "=", "")));
        dataCopy = JSON.parse(JSON.stringify(resetData));
        Object.assign(dataCopy, savedFile);
        for (var i = 0; i < varData.length; i++) {
          this[varData[i]] = dataCopy[i];
        }
        debugStr = dataCopy;
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
    timeNow = new Date().getTime();
    for (var i = 2; i < 9; i++) {
      for (var j = 2; j < 9; j++) {
        for (var k = 0; k < 3; k++) {
          thisPoint = (i-2)*7+j-2;
          farFromCenter = Math.abs((thisPoint)%7-3)+Math.abs(Math.floor((thisPoint)/7)-3);
          if (maps[mapNow][thisPoint] != 1 && pickaxeUsed[mapNow][thisPoint] < timeNow-(((farFromCenter-1)**6+1)*10000)/(upgradeBought[0]+1)**2 && pickaxeUsed[mapNow][thisPoint] != 0) {
            opening = 0;
            maps[mapNow][thisPoint] = 1;
          }
          if (tiles[mapNow][thisPoint] == 0 && hoeUsed[mapNow][thisPoint] < timeNow-(600000/(upgradeBought[1]**2+1)) && hoeUsed[mapNow][thisPoint] != 0) {
            opening = 0;
            tiles[mapNow][thisPoint] = 5;
          }
          if (k == 0) {
            tileName = tileImageBackground[maps[mapNow][(i-2)*7+j-2]];
          } else if (k == 1) {
            if (tiles[mapNow][thisPoint] >= 1 && tiles[mapNow][thisPoint] < 15) {
              tiles[mapNow][thisPoint] = 5;
              if (thisPoint >= 7 && tiles[mapNow][thisPoint-7] > 14) {
                tiles[mapNow][thisPoint] += tiles[mapNow][thisPoint-7]-14;
              }
              if (thisPoint <= 41 && tiles[mapNow][thisPoint+7] > 14) {
                tiles[mapNow][thisPoint] += tiles[mapNow][thisPoint+7]-14;
              }
              if (thisPoint%7 != 0 && tiles[mapNow][thisPoint-1] > 14) {
                tiles[mapNow][thisPoint] += tiles[mapNow][thisPoint-1]-14;
              }
              if ((thisPoint+1)%7 != 0 && tiles[mapNow][thisPoint+1] > 14) {
                tiles[mapNow][thisPoint] += tiles[mapNow][thisPoint+1]-14;
              }
            }
            tileName = tileImageTile[tiles[mapNow][thisPoint]];
          } else if (k == 2) {
            tileName = tileImageThing[things[mapNow][(i-2)*7+j-2]];
          }
          $('#l' + i + 'C' + j + 'Z' + k).css('background-image', 'url(' + tileName + ')');
        }
      }
    }
    if (maps[mapNow][3] == 1 && mapNow == 0) {
      if (gateKey[0] == 1) {
        $('#l1C5Z2').css('background-image', 'url(Resource/Portal/1O.png)');
      } else {
        $('#l1C5Z2').css('background-image', 'url(Resource/Portal/1C.png)');
      }
    }
    if (maps[mapNow][21] == 1 && mapNow == 0) {
      if (gateKey[1] == 1) {
        $('#l5C1Z2').css('background-image', 'url(Resource/Portal/4O.png)');
      } else {
        $('#l5C1Z2').css('background-image', 'url(Resource/Portal/4C.png)');
      }
    }
    if (maps[mapNow][27] == 1 && mapNow == 0) {
      if (gateKey[2] == 1) {
        $('#l5C9Z2').css('background-image', 'url(Resource/Portal/2O.png)');
      } else {
        $('#l5C9Z2').css('background-image', 'url(Resource/Portal/2C.png)');
      }
    }
    if (maps[mapNow][45] == 1 && mapNow == 0) {
      if (gateKey[3] == 1) {
        $('#l9C5Z2').css('background-image', 'url(Resource/Portal/3O.png)');
      } else {
        $('#l9C5Z2').css('background-image', 'url(Resource/Portal/3C.png)');
      }
    }
  }
  $(document).on('mouseover','.farmThing',function(e) {
    thisCell = $(".farmThing").index(this);
    thisPoint = Math.floor((thisCell-9)/9)*7+thisCell%9-1;
    farFromCenter = Math.abs((thisPoint)%7-3)+Math.abs(Math.floor((thisPoint)/7)-3);
    cellStatus = '';
    if ((0 <= thisCell && thisCell <= 8) || (72 <= thisCell && thisCell <= 80) || (thisCell%9 == 0) || ((thisCell+1)%9 == 0)) {
      if (maps[mapNow][3] == 1 && mapNow == 0 && thisCell == 4) {
        cellStatus += 'Fire Portal<br>';
      } else if (maps[mapNow][27] == 1 && mapNow == 0 && thisCell == 44) {
        cellStatus += 'Jungle Portal<br>';
      } else if (maps[mapNow][45] == 1 && mapNow == 0 && thisCell == 36) {
        cellStatus += 'Space Portal<br>';
      } else if (maps[mapNow][21] == 1 && mapNow == 0 && thisCell == 76) {
        cellStatus += 'Ice Portal<br>';
      } else {
        cellStatus += 'Locked!<br>'
      }
    } else if (maps[mapNow][thisPoint] >= 1) {
      if (tiles[mapNow][thisPoint] != 0 && tiles[mapNow][thisPoint] < 15) {
        cellStatus += 'Farm Lv.' + (tiles[mapNow][thisPoint]-4) + '<br>Select seed and click!<br>(Hand)';
      } else if (maps[mapNow][thisPoint] >= 1 && tiles[mapNow][thisPoint] < 15) {
        if (hoeUsed[mapNow][thisPoint] != 0) {
          cellStatus += 'Grass Field<br>Making Grass Field!<br>(Hoe ' + timeNotation((hoeUsed[mapNow][thisPoint]+(600000)/(upgradeBought[1]**2+1))-timeNow) + ')'
        } else {
          cellStatus += 'Grass Field<br>Click to make farm/make!<br>(Hoe ' + timeNotation(600000/(upgradeBought[1]**2+1)) + '/Hand)';
        }
      } else if (tiles[mapNow][thisPoint] >= 15) {
        cellStatus += 'Pond Lv.' + (tiles[mapNow][thisPoint]-14) + '<br>Click to upgrade/destory!<br>(Hand/Pickaxe)';
      }
    } else if ((thisPoint >= 7 && maps[mapNow][thisPoint-7] >= 1) || (thisPoint <= 41 && maps[mapNow][thisPoint+7] >= 1) || (thisPoint%7 != 0 && maps[mapNow][thisPoint-1] >= 1) || ((thisPoint+1)%7 != 0 && maps[mapNow][thisPoint+1] >= 1)) {
      if (pickaxeUsed[mapNow][thisPoint] != 0) {
        cellStatus += 'Block<br>Making grass field!<br>(' + timeNotation((pickaxeUsed[mapNow][thisPoint]+(((farFromCenter-1)+1)**6*10000)/(upgradeBought[0]**2+1))-timeNow) + ')';
      } else if (opening == 1) {
        cellStatus += 'Already working!<br>';
      } else {
        cellStatus += 'Block<br>Click to make grass field!<br>(Piakaxe ' + timeNotation((((farFromCenter-1)+1)**6*10000)/(upgradeBought[0]**2+1)) + ')';
      }
    }
    if (cellStatus == '') {
      cellStatus += 'Locked!'
    }
    $('#cellStatus').html(function (index,html) {
      return cellStatus;
    });
    $('#cellStatus').show();
  });
  $(document).on('mouseout','.farmThing',function(e) {
    $('#cellStatus').hide();
  });
  $(document).on('click','.farmThing',function() {
    thisCell = $(".farmThing").index(this);
    thisPoint = Math.floor((thisCell-9)/9)*7+thisCell%9-1;
    farFromCenter = Math.abs((thisPoint)%7-3)+Math.abs(Math.floor((thisPoint)/7)-3);
    if ((0 <= thisCell && thisCell <= 8) || (72 <= thisCell && thisCell <= 80) || (thisCell%9 == 0) || ((thisCell+1)%9 == 0)) {
      if (maps[mapNow][3] == 1 && mapNow == 0 && thisCell == 4 && gateKey[0] == 1) {
        if (1 == 1) {
          alert('Comming Soon...');
        } else {
          mapNow = 1;
        }
      } else if (maps[mapNow][27] == 1 && mapNow == 0 && thisCell == 44 && gateKey[1] == 1) {
        if (1 == 1) {
          alert('Comming Soon...');
        } else {
          mapNow = 2;
        }
      } else if (maps[mapNow][45] == 1 && mapNow == 0 && thisCell == 36 && gateKey[2] == 1) {
        if (1 == 1) {
          alert('Comming Soon...');
        } else {
          mapNow = 3;
        }
      } else if (maps[mapNow][21] == 1 && mapNow == 0 && thisCell == 76 && gateKey[3] == 1) {
        if (1 == 1) {
          alert('Comming Soon...');
        } else {
          mapNow = 4;
        }
      }
    } else if (maps[mapNow][thisPoint] >= 1) {
      if (tiles[mapNow][thisPoint] != 0) {
        cellStatus += 'Farm Lv.' + tiles[mapNow][thisPoint] + '<br>Select seed or creature and Click!';
      } else if (maps[mapNow][thisPoint] >= 1) {
        if (hoeUsed[mapNow][thisPoint] == 0 && opening == 0 && toolSel == 1) {
          opening = 1;
          hoeUsed[mapNow][thisPoint] = new Date().getTime();
        }
      }
    } else if ((thisPoint >= 7 && maps[mapNow][thisPoint-7] >= 1) || (thisPoint <= 41 && maps[mapNow][thisPoint+7] >= 1) || (thisPoint%7 != 0 && maps[mapNow][thisPoint-1] >= 1) || ((thisPoint+1)%7 != 0 && maps[mapNow][thisPoint+1] >= 1)) {
      if (pickaxeUsed[mapNow][thisPoint] == 0 && opening == 0 && toolSel == 0) {
        opening = 1;
        pickaxeUsed[mapNow][thisPoint] = new Date().getTime();
      }
    }
    displayMap();
  });
  $(document).on('click','#tools > span',function() {
    toolSel = $("#tools > span").index(this);
    $("#tools > span").removeClass('toolSel');
    $("#tools > span:eq(" + toolSel + ")").addClass('toolSel');
  });
  $(document).on('click','#changeShop > span',function() {
    indexSel = $("#changeShop > span").index(this);
    switch (indexSel) {
      case 0:
        shopPage--;
        if (shopPage < 0) {
          shopPage = 3;
        }
        break;
      case 2:
        shopPage++;
        if (shopPage >= 4) {
          shopPage = 0;
        }
        break;
      default:
    }
    $("#warpShop > div").hide();
    $("#warpShop > div:eq(" + shopPage + ")").show();
    $('#changeShop > span:eq(1)').html(function (index,html) {
      return shopName[shopPage];
    });
  });

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
  $('#cellStatus').hide();
  $("#warpShop > div").hide();
  $("#warpShop > div:eq(0)").show();
  displayMap();
});
