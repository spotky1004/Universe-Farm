$(function (){
  notationForm = 0;
  screenWidthBef = 0;
  screenHeightBef = 0;
  coin = 0;
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
  farming = 0;
  farmOn = 0;
  breakConfrim = 0;
  pondCount = [0, 0, 0, 0, 0, 0];
  gateKey = [0, 0, 0, 0, 0, 0];
  debugStr = '';

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
    saveFile = [];
    for (var i = 0; i < varData.length; i++) {
      saveFile[i] = eval(varData[i]);
    }
    localStorage.setItem('saveFile', JSON.stringify(saveFile));
  }
  function gameLoad() {
    savedFile = JSON.parse(localStorage.getItem('saveFile'));
    dataCopy = JSON.parse(JSON.stringify(resetData));
    Object.assign(dataCopy, savedFile);
    for (var i = 0; i < varData.length; i++) {
      this[varData[i]] = dataCopy[i];
    }
  }
  function displayPlayer() {
    $('#coin').html(function (index,html) {
      return notation(coin);
    });
    $('#diamond').html(function (index,html) {
      return dia;
    });
    $('#level').html(function (index,html) {
      return 'Lv '+ level;
    });
    $('#exp').html(function (index,html) {
      return notation(exp) + ' / ' + notation(expNeed) + ' EXP (' + (exp/expNeed*100).toFixed(1) + '%)';
    });
    expNeed = 1.8**(level-1)*10
    if (exp >= expNeed) {
      level++;
      exp -= expNeed;
      levelUp();
    }
    $("#levelProgress").attr({
      'value' : exp/expNeed
    });
  }
  function displayMap() {
    screenWidth = $(window).width();
    screenHeight = $(window).height();
    changed = 0;
    if (screenWidth >= screenHeight) {
      blankSpace = (screenWidth-screenHeight)/2-0.5;
      $('#farm').css('left', blankSpace + 'px');
      $('#farm').css('top','5vh');
      $('#farm').css('width','90vh');
      $('#farm').css('height','90vh');
      changed++;
    } else {
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
            farming = 0;
            tiles[mapNow][thisPoint] = 5;
          }
          if (k == 0) {
            tileName = tileImageBackground[maps[mapNow][thisPoint]];
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
            if (maps[mapNow][thisPoint] != 1 && pickaxeUsed[mapNow][thisPoint] != 0) {
              blockStatus = Math.floor((1-(pickaxeUsed[mapNow][thisPoint]-(timeNow-((((farFromCenter-1)**6+1)*10000)/(upgradeBought[0]+1)**2)))/((((farFromCenter-1)**6+1)*10000)/(upgradeBought[0]+1)**2))*5)+1;
              tileName = 'Resource/Motion/b' + blockStatus + '.png';
            }
            if (tiles[mapNow][thisPoint] == 0 && hoeUsed[mapNow][thisPoint] != 0) {
              blockStatus = Math.floor((1-(((hoeUsed[mapNow][thisPoint])-(timeNow-(600000/(upgradeBought[1]**2+1))))/((600000/(upgradeBought[1]**2+1)))))*5)+1;
              tileName = 'Resource/Motion/f' + blockStatus + '.png';
            }
          } else if (k == 2) {
            if (plantPlantedTime[mapNow][thisPoint] != 0) {
              seedNum = plantPlantedSeed[mapNow][thisPoint]-1;
              blockStatus = Math.floor((1-((plantPlantedTime[mapNow][thisPoint]+(plantTime[seedNum]*1000/((tiles[mapNow][thisPoint]-5)/2+1)))-timeNow)/(plantTime[seedNum]*1000/((tiles[mapNow][thisPoint]-5)/2+1)))*(plantLevels[seedNum]-1))+1;
              if (0 >= ((plantPlantedTime[mapNow][thisPoint]+(plantTime[seedNum]*1000/((tiles[mapNow][thisPoint]-5)/2+1)))-timeNow)/(plantTime[seedNum]*1000/((tiles[mapNow][thisPoint]-5)/2+1))) {
                plantPlantedTime[mapNow][thisPoint] = timeNow-(plantTime[seedNum]*1000/((tiles[mapNow][thisPoint]-5)/2+1));
              }
              tileName = 'Resource/Plant/' + (seedNum+1) + '-' + blockStatus + '.png';
            } else {
              tileName = 'Resource/trans.png';
            }
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
  function displayShop() {
    $('#creatureThing > span:eq(0)').html(function (index,html) {
      return 'Pond<br>' + notation(100*3**pondCount[mapNow]) + ' G';
    });
    upgradeCost = [
      100*3**upgradeBought[0],
      100*9**upgradeBought[1],
      100*33**upgradeBought[2]
    ];
    for (var i = 0; i < 3; i++) {
      $('.upgradeThing:eq(' + i + ')').attr({
        'class' : 'upgradeThing upgrade' + ((coin >= upgradeCost[i]) ? 'Y' : 'N')
      });
      $('.upgradeThing:eq(' + i + ') > div:eq(0) > span').html(function (index,html) {
        return upgradeBought[i];
      });
      $('.upgradeThing:eq(' + i + ') > span:eq(1)').html(function (index,html) {
        return notation(upgradeCost[i]) + ' G';
      });
    }
  }
  function displayInventory() {
    $('#innerInventory').html(function (index,html) {
      return '';
    });
    thingsHave = 0;
    for (var i = 0; i < plantInventory.length; i++) {
      if (plantInventory[i] >= 1) {
        $('<div>').addClass('inventoryItem').appendTo('#innerInventory');
        $('<span>').appendTo('.inventoryItem:eq(' + thingsHave + ')');
        $('<span>').appendTo('.inventoryItem:eq(' + thingsHave + ')');
        $('<div>').appendTo('.inventoryItem:eq(' + thingsHave + ') > span:eq(1)');
        $('<div>').appendTo('.inventoryItem:eq(' + thingsHave + ') > span:eq(1)');
        $('.inventoryItem:eq(' + thingsHave + ') > span:eq(0)').attr({
          'style' : 'background-image: url(Resource/Plant/' + (i+1) + '-' + plantLevels[i] + '.png)'
        });
        $('.inventoryItem:eq(' + thingsHave + ') > span:eq(1) > div:eq(0)').html(function (index,html) {
          return plantName[i] + ' (Sell Price: ' + notation(plantSellPrice[i]) + ')';
        });
        $('.inventoryItem:eq(' + thingsHave + ') > span:eq(1) > div:eq(1)').html(function (index,html) {
          return 'You own: ' + plantInventory[i];
        });
        thingsHave++;
      }
    }
  }
  function levelUp() {
    $('#seedThing').html(function (index,html) {
      return '';
    });
    for (var i = 0; i < plantLevels.length; i++) {
      if (plantLvReq[i-1] <= level || i == 0) {
        if (plantLvReq[i] <= level) {
          $('<span>').addClass('handBlock').addClass('reqY').appendTo('#seedThing');
        } else {
          $('<span>').addClass('handBlock').addClass('reqN').appendTo('#seedThing');
        }
        $("#seedThing > span:eq(" + i + ")").attr({
          'style' : 'background-image: url(Resource/Plant/' + (i+1) + '-1.png)'
        });
        $('#seedThing > span:eq(' + i + ')').html(function (index,html) {
          return 'req: ' + plantLvReq[i] + 'Lv';
        });
      }
    }
  }
  function cellStatusSet(num) {
    thisCell = num;
    thisPoint = Math.floor((thisCell-9)/9)*7+thisCell%9-1;
    farFromCenter = Math.abs((thisPoint)%7-3)+Math.abs(Math.floor((thisPoint)/7)-3);
    cellStatus = '';
    if (plantPlantedSeed[mapNow][thisPoint] >= 1) {
      seedNum = plantPlantedSeed[mapNow][thisPoint]-1;
      cellStatus += plantName[seedNum] + '<br>Seed planted here!<br>(Mature: ' + timeNotation((plantPlantedTime[mapNow][thisPoint]+(plantTime[seedNum]*1000/((tiles[mapNow][thisPoint]-5)/2+1)))-timeNow) + ')';
    } else if ((0 <= thisCell && thisCell <= 8) || (72 <= thisCell && thisCell <= 80) || (thisCell%9 == 0) || ((thisCell+1)%9 == 0)) {
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
        if (handType == 2 && toolSel == 2) {
          seedNum = handSel;
          cellStatus += 'Farm Lv.' + (tiles[mapNow][thisPoint]-4) + '<br>Select seed and click!<br>(Hand ' + timeNotation(plantTime[seedNum]*1000/((tiles[mapNow][thisPoint]-5)/2+1)) + ')';
        } else {
          cellStatus += 'Farm Lv.' + (tiles[mapNow][thisPoint]-4) + '<br>Select seed and click/destory!<br>(Hand/Hoe)';
        }
      } else if (maps[mapNow][thisPoint] >= 1 && tiles[mapNow][thisPoint] < 15) {
        if (hoeUsed[mapNow][thisPoint] != 0) {
          cellStatus += 'Grass Field<br>Making farm!<br>(Hoe ' + timeNotation((hoeUsed[mapNow][thisPoint]+(600000)/(upgradeBought[1]**2+1))-timeNow) + ')<br>Click again to cancel<br>'
        } else {
          cellStatus += 'Grass Field<br>Click to make farm/make!<br>(Hoe ' + timeNotation(600000/(upgradeBought[1]**2+1)) + '/Hand)';
        }
      } else if (tiles[mapNow][thisPoint] >= 15) {
        if (tiles[mapNow][thisPoint] <= 17) {
          if (breakConfrim == 0) {
            cellStatus += 'Pond Lv.' + (tiles[mapNow][thisPoint]-14) + '<br>Click to upgrade/destory!<br>(Hand/Pickaxe)<br>Cost: ' + notation(100*3**pondCount[mapNow]);
          } else {
            cellStatus += 'Pond Lv.' + (tiles[mapNow][thisPoint]-14) + '<br>Click one more time to break<br>';
          }
        } else {
          cellStatus += 'Pond Lv.Max<br>Click to destory!<br>(Pickaxe)<br>';
        }
      }
    } else if ((thisPoint >= 7 && maps[mapNow][thisPoint-7] >= 1) || (thisPoint <= 41 && maps[mapNow][thisPoint+7] >= 1) || (thisPoint%7 != 0 && maps[mapNow][thisPoint-1] >= 1) || ((thisPoint+1)%7 != 0 && maps[mapNow][thisPoint+1] >= 1)) {
      if (pickaxeUsed[mapNow][thisPoint] != 0) {
        cellStatus += 'Block<br>Making grass field!<br>(' + timeNotation((pickaxeUsed[mapNow][thisPoint]+(((farFromCenter-1)**6+1)*10000)/(upgradeBought[0]**2+1))-timeNow) + ')<br>Click again to cancel';
      } else if (opening == 1) {
        cellStatus += 'Already working!<br>';
      } else {
        cellStatus += 'Block<br>Click to make grass field!<br>(Pickaxe ' + timeNotation((((farFromCenter-1)**6+1)*10000)/(upgradeBought[0]**2+1)) + ')';
      }
    }
    if (cellStatus == '') {
      cellStatus += 'Locked!'
    }
    $('#cellStatus').html(function (index,html) {
      return cellStatus;
    });
  }
  $(document).on('mouseover','.farmThing',function(e) {
    thisCell = $(".farmThing").index(this);
    farmOn = 1;
    cellStatusSet(thisCell);
    $('#cellStatus').show();
  });
  $(document).on('mouseout','.farmThing',function(e) {
    farmOn = 0;
    breakConfrim = 0;
    $('#cellStatus').hide();
  });
  $(document).on('click','.farmThing',function() {
    thisCell = $(".farmThing").index(this);
    thisPoint = Math.floor((thisCell-9)/9)*7+thisCell%9-1;
    farFromCenter = Math.abs((thisPoint)%7-3)+Math.abs(Math.floor((thisPoint)/7)-3);
    if (tiles[mapNow][thisPoint] >= 15) {
      if (toolSel == 0) {
        if (breakConfrim == 1) {
          coin -= 50*3**(pondCount[mapNow]-1);
          pondCount[mapNow] -= tiles[mapNow][thisPoint]-14;
          tiles[mapNow][thisPoint] = 0;
        } else {
          breakConfrim++;
        }
      } else if (toolSel == 2 && coin >= 100*3**pondCount[mapNow] && maps[mapNow][thisPoint] >= 1 && tiles[mapNow][thisPoint] <= 17) {
        coin -= 100*3**pondCount[mapNow];
        pondCount[mapNow]++;
        tiles[mapNow][thisPoint]++;
      }
    } else if (plantPlantedSeed[mapNow][thisPoint] >= 1) {
      seedNum = plantPlantedSeed[mapNow][thisPoint]-1;
      if (0 >= ((plantPlantedTime[mapNow][thisPoint]+(plantTime[seedNum]*1000/((tiles[mapNow][thisPoint]-5)/2+1)))-timeNow)/(plantTime[seedNum]*1000/((tiles[mapNow][thisPoint]-5)/2+1))) {
        plantInventory[seedNum]++;
        exp += 5*2**seedNum;
        if (Math.random() < upgradeBought[2]/100) {
          dia += 2**plantPlantedSeed[mapNow][thisPoint];
        }
        plantPlantedSeed[mapNow][thisPoint] = 0;
        plantPlantedTime[mapNow][thisPoint] = 0;
        displayInventory();
      }
    } else if (toolSel == 2) {
      if (handType == 1) {
        if (coin >= 100*3**pondCount[mapNow] && tiles[mapNow][thisPoint] == 0 && maps[mapNow][thisPoint] >= 1) {
          coin -= 100*3**pondCount[mapNow];
          pondCount[mapNow]++;
          tiles[mapNow][thisPoint] = 15;
        }
      } else if (handType == 2 && maps[mapNow][thisPoint] >= 1 && plantPlantedSeed[mapNow][thisPoint] == 0 && (1 <= tiles[mapNow][thisPoint] && tiles[mapNow][thisPoint] < 15)) {
        plantPlantedSeed[mapNow][thisPoint] = handSel+1;
        plantPlantedTime[mapNow][thisPoint] = new Date().getTime();
      }
    } else if (toolSel == 1 && maps[mapNow][thisPoint] >= 1 && (1 <= tiles[mapNow][thisPoint] && tiles[mapNow][thisPoint] < 15)) {
      tiles[mapNow][thisPoint] = 0;
      hoeUsed[mapNow][thisPoint] = 0;
    } else if ((0 <= thisCell && thisCell <= 8) || (72 <= thisCell && thisCell <= 80) || (thisCell%9 == 0) || ((thisCell+1)%9 == 0)) {
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
        if (hoeUsed[mapNow][thisPoint] == 0 && farming == 0 && toolSel == 1) {
          farming = 1;
          hoeUsed[mapNow][thisPoint] = new Date().getTime();
        } else if (hoeUsed[mapNow][thisPoint] != 0 && farming != 0) {
          farming = 0;
          hoeUsed[mapNow][thisPoint] = 0;
        }
      }
    } else if ((thisPoint >= 7 && maps[mapNow][thisPoint-7] >= 1) || (thisPoint <= 41 && maps[mapNow][thisPoint+7] >= 1) || (thisPoint%7 != 0 && maps[mapNow][thisPoint-1] >= 1) || ((thisPoint+1)%7 != 0 && maps[mapNow][thisPoint+1] >= 1)) {
      if (pickaxeUsed[mapNow][thisPoint] == 0 && opening == 0 && toolSel == 0) {
        opening = 1;
        pickaxeUsed[mapNow][thisPoint] = new Date().getTime();
      } else if (pickaxeUsed[mapNow][thisPoint] != 0 && opening != 0) {
        opening = 0;
        pickaxeUsed[mapNow][thisPoint] = 0;
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
  $(document).on('click','#creatureThing > span',function() {
    indexSel = $("#creatureThing > span").index(this);
    handType = 1;
    switch (indexSel) {
      case 0:
        handSel = 1;
        break;
      default:
        alert('error!');
    }
  });
  $(document).on('click','#seedThing > span:not(.reqN)',function() {
    handType = 2;
    handSel = $("#seedThing > span").index(this);
  });
  $(document).on('click','.inventoryItem',function() {
    indexThis = $(".inventoryItem").index(this);
    plantIndex = 0;
    for (var i = 0; i < plantInventory.length; i++) {
      if (plantInventory[i] >= 1) {
        if (plantIndex == indexThis) {
          plantSelected = i;
          break;
        } else {
          plantIndex++;
        }
      }
    }
    plantInventory[plantSelected]--;
    coin += plantSellPrice[plantSelected];
    displayInventory();
  });
  $(document).on('click','#innerUpgrade > div:not(.upgradeN)',function() {
    indexThis = $("#innerUpgrade > div").index(this);
    coin -= upgradeCost[indexThis];
    upgradeBought[indexThis]++;
    displayShop();
  });

  setInterval( function (){
    displayMap();
    displayPlayer();
    displayShop();
    if (farmOn == 1) {
      cellStatusSet(thisCell);
    }
  }, 100);
  setInterval( function (){
    gameSave();
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
  gameLoad();
  gameSave();
  displayMap();
  displayInventory();
  levelUp();
});
function gameReset() {
  for (var i = 0; i < varData.length; i++) {
    this[varData[i]] = resetData[i];
  }
  saveFile = [];
  for (var i = 0; i < varData.length; i++) {
    saveFile[i] = eval(varData[i]);
  }
  localStorage.setItem('saveFile', JSON.stringify(saveFile));
  location.reload();
}
