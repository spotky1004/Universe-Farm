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
  thingSelected = 0;
  breakConfrim = 0;
  bulkSellCount = 1;
  bulkCraftCount = 1;
  bonusExp = 1;
  rp = 0;
  matCanCraft = [];
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
      displayCraft();
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
      $('.craftBlock').css('height', (screenWidthBef*0.09+16) + 'px');
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
                if (tiles[mapNow][thisPoint] >= 10) {
                  tiles[mapNow][thisPoint] = 10;
                }
              }
              if (thisPoint <= 41 && tiles[mapNow][thisPoint+7] > 14) {
                tiles[mapNow][thisPoint] += tiles[mapNow][thisPoint+7]-14;
                if (tiles[mapNow][thisPoint] >= 10) {
                  tiles[mapNow][thisPoint] = 10;
                }
              }
              if (thisPoint%7 != 0 && tiles[mapNow][thisPoint-1] > 14) {
                tiles[mapNow][thisPoint] += tiles[mapNow][thisPoint-1]-14;
                if (tiles[mapNow][thisPoint] >= 10) {
                  tiles[mapNow][thisPoint] = 10;
                }
              }
              if ((thisPoint+1)%7 != 0 && tiles[mapNow][thisPoint+1] > 14) {
                tiles[mapNow][thisPoint] += tiles[mapNow][thisPoint+1]-14;
                if (tiles[mapNow][thisPoint] >= 10) {
                  tiles[mapNow][thisPoint] = 10;
                }
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
      return '<div id=bulkSell class=clearFix><span>x1</span><span>x10</span><span>x100</span><span>xMax</span></div>';
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
    thingsHave = 0;
    for (var i = 0; i < material.length; i++) {
      if (material[i] >= 1) {
        $('<div>').addClass('inventoryItemMat').appendTo('#innerInventory');
        $('<span>').appendTo('.inventoryItemMat:eq(' + thingsHave + ')');
        $('<span>').appendTo('.inventoryItemMat:eq(' + thingsHave + ')');
        $('<div>').appendTo('.inventoryItemMat:eq(' + thingsHave + ') > span:eq(1)');
        $('.inventoryItemMat:eq(' + thingsHave + ') > span:eq(0)').attr({
          'style' : 'background-image: url(Resource/Material/' + (i+1) + '.png)'
        });
        $('.inventoryItemMat:eq(' + thingsHave + ') > span:eq(1) > div:eq(0)').html(function (index,html) {
          return 'You own: ' + material[i];
        });
        thingsHave++;
      }
    }
  }
  function displayCraft() {
    $('#craftMaterial').html(function (index,html) {
      return '<div id=bulkCraft class=clearFix><span>x1</span><span>x10</span><span>x100</span><span>xMax</span></div>';
    });
    thingsIndex = 0;
    thingsHave = 0;
    matCanCraft = [];
    for (var i = 0; i < craftLvReq.length; i++) {
      if (craftLvReq[i] <= level) {
        maxBulk = [0, 0, 0];
        thingCount = [0, 0, 0];
        imgPath = ['', '', ''];
        for (var j = 0; j < 3; j++) {
          if (craftMaterialId[i][j] == 0) {
            maxBulk[j] = 100000;
          } else if (craftMaterialId[i][j] <= 100) {
            thingCount[j] = plantInventory[craftMaterialId[i][j]-1];
            imgPath[j] = 'Plant/' + (craftMaterialId[i][j]) + '-' + plantLevels[craftMaterialId[i][j]-1];
            maxBulk[j] = Math.floor(thingCount[j]/craftMaterialQuantity[i][j]);
          } else if (craftMaterialId[i][j] <= 200) {
            thingCount[j] = material[craftMaterialId[i][j]-101];
            imgPath[j] = 'Material/' + (craftMaterialId[i][j]-101+1);
            maxBulk[j] = Math.floor(thingCount[j]/craftMaterialQuantity[i][j]);
          } else {
            if (craftMaterialId[i][j] == 201) {
              thingCount[j] = coin;
              imgPath[j] = 'etc/coin';
              maxBulk[j] = Math.floor(thingCount[j]/craftMaterialQuantity[i][j]);
            } else if (craftMaterialId[i][j] == 202) {
              thingCount[j] = dia;
              imgPath[j] = 'etc/diamond';
              maxBulk[j] = Math.floor(thingCount[j]/craftMaterialQuantity[i][j]);
            }
          }
        }
        if (Math.min(maxBulk[0], maxBulk[1], maxBulk[2]) != 0) {
          $('<span>').addClass('craftBlock').css('height', (screenWidthBef*0.09+16) + 'px').addClass('craftY').appendTo('#craftMaterial');
          craftMaxBulk[thingsIndex] = Math.min(maxBulk[0], maxBulk[1], maxBulk[2]);
        } else {
          $('<span>').addClass('craftBlock').css('height', (screenWidthBef*0.09+16) + 'px').addClass('craftN').appendTo('#craftMaterial');
        }
        $('<span>').appendTo('.craftBlock:eq(' + thingsHave + ')');
        $('<span>').appendTo('.craftBlock:eq(' + thingsHave + ')');
        $('<div>').appendTo('.craftBlock:eq(' + thingsHave + ')');
        $('<div>').appendTo('.craftBlock:eq(' + thingsHave + ') > div');
        $('<div>').appendTo('.craftBlock:eq(' + thingsHave + ') > div');
        $('<div>').appendTo('.craftBlock:eq(' + thingsHave + ') > div');
        $('.craftBlock:eq(' + thingsHave + ') > span:eq(0)').html(function (index,html) {
          return craftName[thingsIndex] + ' (' + Math.min(bulkCraftCount, Math.min(maxBulk[0], maxBulk[1], maxBulk[2])) + ')';
        });
        $('.craftBlock:eq(' + thingsHave + ') > span:eq(0)').attr({
          'style' : 'background-image: url(Resource/Material/' + (thingsIndex+1) + '.png)'
        });
        $('.craftBlock:eq(' + thingsHave + ') > span:eq(1)').html(function (index,html) {
          return '+' + notation(craftTech[thingsIndex]) + ' RP';
        });
        for (var j = 0; j < 3; j++) {
          $('<span>').appendTo('.craftBlock:eq(' + thingsHave + ') > div > div:eq(' + j + ')');
          if (thingCount[j] >= craftMaterialQuantity[i][j]) {
            $('<p>').addClass('materialBack').addClass('materialY').appendTo('.craftBlock:eq(' + thingsHave + ') > div > div:eq(' + j + ')');
          } else {
            $('<p>').addClass('materialBack').addClass('materialN').appendTo('.craftBlock:eq(' + thingsHave + ') > div > div:eq(' + j + ')');
          }
          if (imgPath[j] != 0) {
            $('.craftBlock:eq(' + thingsHave + ') > div > div:eq(' + j + ') > span').attr({
              'style' : 'background-image: url(Resource/' + imgPath[j] + '.png)'
            });
          }
        }
        $('.craftBlock:eq(' + thingsHave + ') > div > div > p').html(function (index,html) {
          if (craftMaterialQuantity[i][index] != 0) {
            return notation(thingCount[index]) + '/' + notation(craftMaterialQuantity[i][index]);
          } else {
            return '';
          }
        });
        thingsHave++;
        matCanCraft.push(thingsIndex);
      }
      thingsIndex++;
    }
  }
  function displayMachine() {
    $('#craftMachine').html(function (index,html) {
      return '';
    });
    for (var i = 0; i < machineType.length; i++) {
      if (machineLevelReq[i] <= level) {
        $('<div>').addClass('machine').appendTo('#craftMachine');
        if (machineUnlocked[i] == 0) {
          canBuy = [0, 0, 0];
          thingCount = [0, 0, 0];
          imgPath = ['', '', ''];
          for (var j = 0; j < 3; j++) {
            if (mechineMaterialId[i][j] <= 100) {
              thingCount[j] = plantInventory[craftMaterialId[i][j]-1];
              imgPath[j] = 'Plant/' + (mechineMaterialId[i][j]) + '-' + plantLevels[mechineMaterialId[i][j]-1];
              canBuy[j] = Math.floor(thingCount[j]/mechineMaterialQuantity[i][j]);
            } else if (mechineMaterialId[i][j] <= 200) {
              thingCount[j] = material[mechineMaterialId[i][j]-101];
              imgPath[j] = 'Material/' + (mechineMaterialId[i][j]-101+1);
              canBuy[j] = Math.floor(thingCount[j]/mechineMaterialQuantity[i][j]);
            } else {
              if (mechineMaterialId[i][j] == 201) {
                thingCount[j] = coin;
                imgPath[j] = 'etc/coin';
                canBuy[j] = Math.floor(thingCount[j]/mechineMaterialQuantity[i][j]);
              } else if (mechineMaterialId[i][j] == 202) {
                thingCount[j] = dia;
                imgPath[j] = 'etc/diamond';
                canBuy[j] = Math.floor(thingCount[j]/mechineMaterialQuantity[i][j]);
              }
            }
          }
          $('<div>').appendTo('#craftMachine > .machine:eq(' + i + ')');
          for (var j = 0; j < 3; j++) {
            $('<div>').appendTo('#craftMachine > .machine:eq(' + i + ') > div');
          }
          for (var j = 0; j < 3; j++) {
            if (mechineMaterialId[i][j] != 0) {
              $('<span>').css('background-image', 'url(Resource/' + imgPath[j] + '.png)').appendTo('#craftMachine > .machine:eq(' + i + ') > div > div:eq(' + j + ')');
              $('<span>').appendTo('#craftMachine > .machine:eq(' + i + ') > div > div:eq(' + j + ')');
              $('#craftMachine > .machine:eq(' + i + ') > div > div:eq(' + j + ') > span:eq(1)').html(function (index,html) {
                return thingCount[j] + '/' + mechineMaterialQuantity[i][j];
              });
            } else {
              $('<span>').appendTo('#craftMachine > .machine:eq(' + i + ') > div > div:eq(' + j + ')');
              $('<span>').appendTo('#craftMachine > .machine:eq(' + i + ') > div > div:eq(' + j + ')');
            }
          }
        } else if (machineType[i] == 0 && machineUnlocked[i] == 1) {
          for (var j = 0; j < 8; j++) {
            $('<span>').appendTo('#craftMachine > .machine:eq(' + i + ')');
          }
          $('<div>').appendTo('#craftMachine > .machine:eq(' + i + ')');
          for (var j = 0; j < 7; j++) {
            if (moduleLevelReq[j] <= level) {
              $('<span>').css('background-image', 'url(Resource/Material/' + (moduleId[j]+1) + '.png)').appendTo('#craftMachine > .machine:eq(' + i + ') > div');
            }
          }
          $('.machine:eq(' + i + ') > span:eq(5)').html(function (index,html) {
            return 'Plant(Hand)/Destory';
          });
          $('.machine:eq(' + i + ') > span:eq(6)').html(function (index,html) {
            return 'De-Assign Module';
          });
          moduleCount = 0;
          for (var j = 0; j < machineStatus[i][0].length; j++) {
            if (machineStatus[i][0][j] >= 1) {
              moduleCount++;
            }
          }
          $('.machine:eq(' + i + ') > span:eq(3)').html(function (index,html) {
            return machineName[i];
          });
          $('#craftMachine > .machine:eq(' + i + ') > span:eq(1)').css('background-image', 'url(Resource/Machine/' + (i+1) + '.png)');
        }
      }
    }
  }
  function terrariumTimeCalc() {
    for (var i = 0; i < 5; i++) {
      if (machineStatus[i][1][0] == 0) {
        $('.machine:eq(' + i + ') > span:eq(4)').html(function (index,html) {
          return 'Module (' + moduleCount + '/' + (i+1) + ') Not out yet :v';
        });
      } else {
        plantNumThis = (machineStatus[i][1][0]-1);
        plantTimeThis = machineStatus[i][1][1]+plantTime[plantNumThis]*1000;
        plantTimeLeft = plantTimeThis-timeNow;
        plantProgress = (1-(plantTimeLeft/(plantTime[plantNumThis]*1000)));
        $('#craftMachine > .machine:eq(' + i + ') > span:eq(0)').css('background-image', 'url(Resource/Plant/' + (plantNumThis+1) + '-' + Math.floor(plantProgress*(plantLevels[plantNumThis]-1)+1) + '.png)');
        if (plantProgress >= 1) {
          plantProgressBulk = Math.floor(plantProgress);
          machineStatus[i][1][1] = timeNow;
          plantInventory[plantNumThis] += plantProgressBulk;
          if (plantNumThis >= 6) {
            bonusExp = 10*1.5**(plantNumThis-6);
          }
          exp += 5*2**plantNumThis*bonusExp*plantProgressBulk;
          if (Math.random() < upgradeBought[2]/100) {
            dia += 2**plantNumThis;
          }
        }
        $('.machine:eq(' + i + ') > span:eq(4)').html(function (index,html) {
          return 'Planted: ' + plantName[plantNumThis] + ', Mature: ' + timeNotation(plantTimeLeft);
        });
      }
    }
  }
  function displayResearch() {
    $('#rpDisplay').html(function (index,html) {
      return 'You have ' + notation(rp) + ' Research Points';
    });
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
          if (breakConfrim == 0) {
            cellStatus += 'Pond Lv.Max<br>Click to destory!<br>(Pickaxe)<br>';
          } else {
            cellStatus += 'Pond Lv.Max<br>Click one more time to break<br>';
          }
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
          coin += 50*3**(pondCount[mapNow]-1);
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
        if (seedNum >= 6) {
          bonusExp = 10*1.5**(seedNum-6);
        }
        exp += 5*2**seedNum*bonusExp;
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
    displayInventory();
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
  $(document).on('click','#craftMenu > span',function() {
    indexSel = $("#craftMenu > span").index(this);
    $("#craftInner > div").hide();
    $("#craftInner > div:eq(" + indexSel + ")").show();
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
  $(document).on('click','#bulkSell > span',function() {
    indexThis = $("#bulkSell > span").index(this);
    switch (indexThis) {
      case 0:
        bulkSellCount = 1;
        break;
      case 1:
        bulkSellCount = 10;
        break;
      case 2:
        bulkSellCount = 100;
        break;
      case 3:
        bulkSellCount = 1e10;
        break;
    }
  });
  $(document).on('click','#bulkCraft > span',function() {
    indexThis = $("#bulkCraft > span").index(this);
    switch (indexThis) {
      case 0:
        bulkCraftCount = 1;
        break;
      case 1:
        bulkCraftCount = 10;
        break;
      case 2:
        bulkCraftCount = 100;
        break;
      case 3:
        bulkCraftCount = 10000;
        break;
    }
    displayCraft();
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
    if (plantInventory[plantSelected] >= bulkSellCount) {
      sellCount = bulkSellCount;
    } else {
      sellCount = plantInventory[plantSelected];
    }
    plantInventory[plantSelected] -= sellCount;
    coin += plantSellPrice[plantSelected]*sellCount;
    displayInventory();
  });
  $(document).on('click','#innerUpgrade > div:not(.upgradeN)',function() {
    indexThis = $("#innerUpgrade > div").index(this);
    coin -= upgradeCost[indexThis];
    upgradeBought[indexThis]++;
    displayShop();
  });
  $(document).on('click','#craftMaterial > .craftBlock:not(.craftN)',function() {
    indexThis = $("#craftMaterial > .craftBlock").index(this);
    thingSelected = matCanCraft[indexThis];
    maxBulk = [0, 0, 0];
    thingCount = [0, 0, 0];
    for (var j = 0; j < 3; j++) {
      if (craftMaterialId[thingSelected][j] == 0) {
        maxBulk[j] = 100000;
      } else if (craftMaterialId[thingSelected][j] <= 100) {
        thingCount[j] = plantInventory[craftMaterialId[thingSelected][j]-1];
        maxBulk[j] = Math.floor(thingCount[j]/craftMaterialQuantity[thingSelected][j]);
      } else if (craftMaterialId[thingSelected][j] <= 200) {
        thingCount[j] = material[craftMaterialId[thingSelected][j]-101];
        maxBulk[j] = Math.floor(thingCount[j]/craftMaterialQuantity[thingSelected][j]);
      } else {
        if (craftMaterialId[thingSelected][j] == 201) {
          thingCount[j] = coin;
          maxBulk[j] = Math.floor(thingCount[j]/craftMaterialQuantity[thingSelected][j]);
        } else if (craftMaterialId[thingSelected][j] == 202) {
          thingCount[j] = dia;
          maxBulk[j] = Math.floor(thingCount[j]/craftMaterialQuantity[thingSelected][j]);
        }
      }
    }
    bulkCraftThis = Math.min(bulkCraftCount, Math.min(maxBulk[0], maxBulk[1], maxBulk[2]));
    for (var j = 0; j < 3; j++) {
      if (craftMaterialId[thingSelected][j] <= 100) {
        plantInventory[craftMaterialId[thingSelected][j]-1] -= craftMaterialQuantity[thingSelected][j]*bulkCraftThis;
      } else if (craftMaterialId[thingSelected][j] <= 200) {
        material[craftMaterialId[thingSelected][j]-101] -= craftMaterialQuantity[thingSelected][j]*bulkCraftThis;
      } else {
        if (craftMaterialId[thingSelected][j] == 201) {
          coin -= craftMaterialQuantity[thingSelected][j]*bulkCraftThis;
        } else if (craftMaterialId[thingSelected][j] == 202) {
          dia -= craftMaterialQuantity[thingSelected][j]*bulkCraftThis;
        }
      }
    }
    material[thingSelected] += bulkCraftThis;
    rp += craftTech[thingSelected]*bulkCraftThis;
    displayCraft();
    displayInventory();
  });
  $(document).on('click','#goCraft',function() {
    $("#warpAll > div:not(:eq(0))").hide();
    $("#craftScreen").show();
  });
  $(document).on('click','#goOption',function() {
    $("#warpAll > div:not(:eq(0))").hide();
    $("#optionScreen").show();
  });
  $(document).on('click','.goGame',function() {
    $("#warpAll > div:not(:eq(0))").hide();
    $("#gameScreen").show();
  });
  $(document).on('click','#optionInnerWarp > div',function() {
    indexThis = $("#optionInnerWarp > div").index(this);
    switch (indexThis) {
      case 0:
        saveFile = {};
        for (var i = 0; i < varData.length; i++) {
          saveFile[i] = eval(varData[i]);
        }
        copyToClipboard(btoa(JSON.stringify(saveFile)));
        $('#optionInnerWarp > div:eq(0)').html(function (index,html) {
          return 'Exported Game!';
        });
        setTimeout(function(){
          $('#optionInnerWarp > div:eq(0)').html(function (index,html) {
            return 'Export Game';
          });
        }, 1500);
        break;
      case 1:
        var inputedSaveN = prompt('Import Save', '');
        var inputedSave = atob(inputedSaveN);
        if (inputedSave != null && inputedSave != '') {
          var cookies = document.cookie.split(";");
          const savedFile = JSON.parse(inputedSave);
          dataCopy = JSON.parse(JSON.stringify(resetData));
          Object.assign(dataCopy, savedFile);
          setTimeout(function(){
            for (var i = 0; i < varData.length; i++) {
              this[varData[i]] = dataCopy[i];
            }
            setTimeout(function(){
              $('#optionInnerWarp > div:eq(1)').html(function (index,html) {
                return 'Import Game';
              });
            }, 1500);
          }, 0);
          $('#optionInnerWarp > div:eq(1)').html(function (index,html) {
            return 'Imported Game!';
          });
          displayMap();
          displayShop();
          displayCraft();
          displayPlayer();
          displayInventory();
        }
        break;
      default:

    }
  });
  $(document).on('click','#craftMachine > .machine',function() {
    indexMach = $('#craftMachine > .machine').index(this);
    if (machineUnlocked[indexMach] == 0) {
      i = indexMach;
      canBuy = [0, 0, 0];
      thingCount = [0, 0, 0];
      for (var j = 0; j < 3; j++) {
        if (mechineMaterialId[i][j] <= 100) {
          thingCount[j] = plantInventory[craftMaterialId[i][j]-1];
          canBuy[j] = Math.floor(thingCount[j]/mechineMaterialQuantity[i][j]);
        } else if (mechineMaterialId[i][j] <= 200) {
          thingCount[j] = material[mechineMaterialId[i][j]-101];
          canBuy[j] = Math.floor(thingCount[j]/mechineMaterialQuantity[i][j]);
        } else {
          if (mechineMaterialId[i][j] == 201) {
            thingCount[j] = coin;
            canBuy[j] = Math.floor(thingCount[j]/mechineMaterialQuantity[i][j]);
          } else if (mechineMaterialId[i][j] == 202) {
            thingCount[j] = dia;
            canBuy[j] = Math.floor(thingCount[j]/mechineMaterialQuantity[i][j]);
          }
        }
      }
      if (canBuy[0] >= 1 && canBuy[1] >= 1 && canBuy[2] >= 1) {
        machineUnlocked[i] = 1;
        for (var j = 0; j < 3; j++) {
          if (mechineMaterialId[i][j] <= 100) {
            plantInventory[craftMaterialId[i][j]-1] -= mechineMaterialQuantity[i][j];
          } else if (mechineMaterialId[i][j] <= 200) {
            material[mechineMaterialId[i][j]-101] -= mechineMaterialQuantity[i][j];
          } else {
            if (mechineMaterialId[i][j] == 201) {
              coin -= mechineMaterialQuantity[i][j];
            } else if (mechineMaterialId[i][j] == 202) {
              dia -= mechineMaterialQuantity[i][j];
            }
          }
        }
        displayMachine();
        switch (indexMach) {
          case 0:
            machineStatus[i] = [[0], [0, 0]];
            break;
          case 1:
            machineStatus[i] = [[0, 0], [0, 0]];
            break;
        }
      }
    }
  });
  $(document).on('click','#craftMachine > .machine > span:nth-child(6)',function() {
    setTimeout(function(){
      if (machineUnlocked[indexMach] != 0) {
        if (machineStatus[indexMach][1][0] == 0 && handType == 2 && toolSel == 2) {
          machineStatus[indexMach][1][0] = (handSel+1);
          machineStatus[indexMach][1][1] = timeNow;
        } else if (machineStatus[indexMach][1][0] != 0) {
          machineStatus[indexMach][1][0] = 0;
          machineStatus[indexMach][1][1] = 0;
        }
      }
      displayMachine();
      terrariumTimeCalc();
    }, 0);
  });

  setInterval( function (){
    displayMap();
    displayPlayer();
    displayShop();
    bugFix();
    terrariumTimeCalc();
    if (farmOn == 1) {
      cellStatusSet(thisCell);
    }
  }, 100);
  setInterval( function (){
    gameSave();
  }, 1000);
  setInterval( function (){
    displayCraft();
    displayMachine();
    displayResearch();
  }, 10000);


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
  $("#warpAll > div:not(:eq(0))").hide();
  $("#craftInner > div:not(:eq(0))").hide();
  $("#gameScreen").show();
  gameLoad();
  gameSave();
  displayMap();
  displayInventory();
  displayCraft();
  displayMachine();
  displayResearch();
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
function bugFix() {
  if (coin < 0) {
    coin = 0;
  }
  if (dia < 0) {
    dia = 0;
  }
  if (pondCount[mapNow] < 0) {
    pondCount[mapNow] = 0;
  }
}
function copyToClipboard(val) {
  var t = document.createElement("textarea");
  document.body.appendChild(t);
  t.value = val;
  t.select();
  document.execCommand('copy');
  document.body.removeChild(t);
}
