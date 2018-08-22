var biddersList = ["criteo", "adriver", "hpmd", "buzzoola", "myTarget", "facebook", "betweenDigital", "aio", "getintent"];

// Begin of BiddersMap section

var biddersMap = {
  biddersMapUse: biddersList,
  campaignIdUsed: {},
  inputTimeout: null,
  remove: function(elem) {
    var bidder = elem.parentNode.getElementsByClassName("bidderName")[0].value;
    biddersMap.biddersMapUse.push(bidder);
    delete biddersMap.campaignIdUsed[bidder];
  },
  updateBiddersMapUse: function(elem) {
    elem.parentNode.parentNode.querySelector(".bidderName").disabled = true;
    var campaign_value = elem.parentNode.querySelector(".bidderId");
    var campaign = elem.value;
    var bidder = elem.parentNode.parentNode.querySelector(".bidderName").value;
    if (elem.value != "") {
      if (isNaN(campaign)) {
        document.getElementById("addBiddersMapUiElement").disabled = true;
        campaign_value.classList.add("err");
        campaign_value.focus();
        document.getElementById("mainError").innerHTML = "В ID кампании должны быть только цифры";
        document.getElementById("mainError").style.visibility = "visible";
      } else {
        main.removeFromArray(biddersMap.biddersMapUse, bidder);
        if (Object.values(biddersMap.campaignIdUsed).indexOf(campaign) == -1) {
          biddersMap.campaignIdUsed[bidder] = campaign;
          if (document.getElementById("generateError").style.visibility == "visible") {
            document.getElementById("generateError").style.visibility = "hidden";
          }
          if (document.getElementById("addBiddersMapUiElement").disabled == true) {
            document.getElementById("addBiddersMapUiElement").disabled = false;
          }
          if (document.getElementsByClassName("err").length > 0) {
            document.getElementsByClassName("err")[0].classList.remove("err");
          }
          if (document.getElementById("mainError").style.visibility == "visible") {
            document.getElementById("mainError").style.visibility = "hidden";
          }
        } else if (Object.values(biddersMap.campaignIdUsed).indexOf(campaign) != -1) {
          document.getElementById("addBiddersMapUiElement").disabled = true;
          // var campaign_value = elem.parentNode.querySelector(".bidderId");
          campaign_value.classList.add("err");
          campaign_value.focus();
          document.getElementById("mainError").innerHTML = "ID кампаний должны быть уникальными.";
          document.getElementById("mainError").style.visibility = "visible";
        }
      }
    }
  },
  addUi: function() {
    if (this.biddersMapUse.length > 0) {
      var bid_map = document.getElementById("biddersMap").childNodes[3];
      map_element = document.createElement("DIV");
      map_element.classList.add("bidder_map");
      map_element_inner = '<select class="bidderName"></select>' +
        '<div class="tooltip">' +
        '<input class="bidderId" type="text" placeholder="ID кампании" oninput="biddersMap.updateBiddersMapUse(this);">' +
        '<span class="tooltiptext">ID кампании биддера из интерфейса ADFOX (уникальный)</span>' +
        '<span class="error notUnique">ID кампании должен быть уникальным</span>' +
        '<span class="error">Должно быть заполнено</span>' +
        '<span class="typeError">Должны быть цифры</span>' +
        '</div>' +
        '<div class="delete" onclick="biddersMap.remove(this);this.parentNode.remove();"></div>';
      map_element.innerHTML = map_element_inner;
      var x = map_element.getElementsByClassName("bidderName")[0];
      for (var i = 0; i < this.biddersMapUse.length; i++) {
        var option = document.createElement("option");
        option.text = this.biddersMapUse[i];
        x.add(option, x[i]);
      }
      bid_map.insertAdjacentElement("beforeEnd", map_element);
    } else if (this.biddersMapUse.length === 0) {
      console.log("No more bidders!");
    }
  },
  addBiddersMapUiElement: function(elem) {
    // biddersMap.addUi();
    if (document.getElementsByClassName("bidderName").length === 0) {
      biddersMap.addUi();
    } else if (document.getElementsByClassName("bidderName").length > 0) {
      if (document.getElementsByClassName("bidderId")[document.getElementsByClassName("bidderId").length - 1].value === "") {
        document.getElementById("mainError").innerHTML = "Заполните все ID кампаний";
        document.getElementById("mainError").style.visibility = "visible";
      } else {
        biddersMap.addUi();
        document.getElementById("mainError").style.visibility = "hidden";
      }
    }
  }
};

// End of BiddersMap section

// Start AdUnits section
var AdUnits = {
  adUnitsUsed: [],
  count: 0,
  inputTimeout: null,
  bidderElementTimeout: null,
  sizesTimeout: null,
  bidderState: [],
  addSizes: function(elem) {
    var bidder = elem.parentNode.parentNode.getElementsByClassName("bidder")[0].value;
    var sizes = elem.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("tooltip")[1].getElementsByClassName("sizes")[0];
    if (bidder === "adriver" || bidder === "betweenDigital") {
      sizes.style.display = "block";
    }
  },
  updateUnitsUsed: function(elem) {
    if (elem.value != "") {
      var index = main.getPreviousSiblings(elem.parentNode.parentNode.parentNode).length;
      if (main.search(AdUnits.adUnitsUsed, elem.value, "code") == undefined) {
        AdUnits.adUnitsUsed[index].code = elem.value;
        // AdUnits.adUnitsUsed[index].bids = [];
        if (elem.parentNode.parentNode.parentNode.getElementsByTagName("button")[0].disabled == true) {
          elem.parentNode.parentNode.parentNode.getElementsByTagName("button")[0].disabled = false;
          document.getElementById("adUnitError").style.visibility = "hidden";
        }
        if (document.getElementById("sameContainer").style.visibility == "visible") {
          document.getElementById("sameContainer").style.visibility = "hidden";
          for (var i = 0; i < generateButtons.length; i += 1) {
            generateButtons[i].disabled = false;
          }
        }
      } else {
        elem.parentNode.parentNode.parentNode.getElementsByTagName("button")[0].disabled = true;
        document.getElementById("sameContainer").innerHTML = "ID контейнеров должны быть уникальными";
        document.getElementById("sameContainer").style.visibility = "visible";
        for (var i = 0; i < generateButtons.length; i += 1) {
          generateButtons[i].disabled = true;
        }
      }
    }
  },
  addUi: function(elem) {
    // console.log(elem.previousElementSibling);
    AdUnits.adUnitsUsed.push({});
    var ad_units = document.getElementById("adUnitsInner");
    units_element = document.createElement("P");
    units_element_inner = '<div class="units_row">' +
      '<div class="delete adUnitDelete" onclick="AdUnits.removeUnit(this);this.parentNode.parentNode.remove();" id="adUnitsCloseButton"></div>' +
      '<div id="adUnitError">ERROR</div>' +
      '<p style="font-size: 15px;color: gray;">ID контейнера ADFOX:</p>' +
      '<div class="tooltip">' +
      '<input class="code" placeholder="container ID" oninput="AdUnits.updateUnitsUsed(this);">' +
      '<span class="tooltiptext adUnitsTooltip">ID контейнера кода вставки ADFOX (уникальный)</span>' +
      '<span class="error adUnitsTooltip">Введите ID контейнера</span>' +
      '</div>' +
      '<div class="tooltip">' +
      '<span class="tooltiptext sizesTooltip">Массив массивов:<br>[Ш,В]<br>или<br>[[Ш,В],[Ш,В]]</span>' +
      '<input class="sizes" placeholder="Размеры" style="display: none;" onkeyup="AdUnits.updateSizes(this)">' +
      '<span class="error required">Размеры обязательны для блока с AdRiver или betweenDigital</span>' +
      '</div> ' +
      '  <br> <div class="units_bidder"> ' +
      '</div> ' +
      '<p style="font-size: 15px;color: gray;">Биддеры и их placement id:</p>' +
      '<button class="default" id="addBidder" onclick="AdUnits.addBidder(this);">Добавить</button>' +
      '</div>';
    units_element.innerHTML = units_element_inner;
    ad_units.insertAdjacentElement("beforeEnd", units_element);
  },
  removeUnit: function(elem) {
    var id = elem.parentNode.id;
    AdUnits.adUnitsUsed.splice(id - 1, 1);
    if (document.getElementById("sameContainer").style.visibility == "visible") {
      document.getElementById("sameContainer").style.visibility = "hidden";
    }
  },
  addAdUnitsUiElement: function(elem) {
    if (document.getElementById("fillAdUnits").style.visibility == "visible") {
      document.getElementById("fillAdUnits").style.visibility = "hidden"
    }
    if (document.getElementsByClassName("bidder_map").length === 0) {
      document.getElementById("mainError").innerHTML = "Сначала добавьте биддеров";
      document.getElementById("mainError").style.visibility = "visible";
      setTimeout(function() {
        document.getElementById("mainError").style.visibility = "hidden";
      }, 2000);
    } else {
      AdUnits.addUi(elem);
    }
  },
  updateSizes: function(elem) {
    clearTimeout(this.sizesTimeout);
    this.sizesTimeout = setTimeout(function() {
      if (document.getElementById("sizesError").style.visibility == "visible") {
        document.getElementById("sizesError").style.visibility = "hidden";
      }
      var index = main.getPreviousSiblings(elem.parentNode.parentNode.parentNode).length;
      if (/\[(.*\S.*)\]/.test(elem.value)) {
        AdUnits.adUnitsUsed[index].sizes = JSON.parse("[" + elem.value + "]");
        elem.parentNode.parentNode.getElementsByTagName("button")[0].disabled = false;
        if (document.getElementById("sizesError").style.visibility == "visible") {
          document.getElementById("sizesError").style.visibility = "hidden";
        }
      } else {
        document.getElementById("sizesError").innerHTML = "Должен быть не пустой массив";
        document.getElementById("sizesError").style.visibility = "visible";
      }
    }, 200);
  },
  updateBidderElement: function(elem) {
    elem.parentNode.parentNode.getElementsByClassName("bidder")[0].disabled = true;
    var index = main.getPreviousSiblings(elem.parentNode.parentNode.parentNode.parentNode.parentNode).length;
    var bidder = elem.parentNode.parentNode.getElementsByClassName("bidder")[0].value;
    var id = elem.value;
    var found = AdUnits.adUnitsUsed.find(function(code) {
      return code.bids.some(function(bid) {
        return bid.bidder === bidder && bid.params.placementId === id;
      });
    });
    if (found == undefined) {
      var bidderExists = main.search(AdUnits.adUnitsUsed[index].bids, bidder, "bidder");
      if (bidderExists != undefined) {
        if (document.getElementById("adUnitError").style.visibility == "visible") {
          document.getElementById("adUnitError").style.visibility = "hidden";
          for (var i = 0; i < generateButtons.length; i += 1) {
            generateButtons[i].disabled = false;
          }
        }
        var position = AdUnits.adUnitsUsed[index].bids.indexOf(bidderExists);
        if (main.alphanumeric.test(id)) {
          if (document.getElementById("wrongLetters").style.visibility == "visible") {
            document.getElementById("wrongLetters").style.visibility = "hidden";
          }
          for (var i = 0; i < generateButtons.length; i += 1) {
            generateButtons[i].disabled = false;
          }
          AdUnits.adUnitsUsed[index].bids[position].params.placementId = id;
        } else {
          document.getElementById("wrongLetters").innerHTML = "Неподдерживаемые символы в placementId " + bidder;
          document.getElementById("wrongLetters").style.visibility = "visible";
          for (var i = 0; i < generateButtons.length; i += 1) {
            generateButtons[i].disabled = true;
          }
        }

      } else {
        if (bidder == "adriver" || bidder == "betweenDigital") {
          var sizes = elem.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("sizes")[0].value;
          if (sizes == "") {
            AdUnits.adUnitsUsed[index].bids.push({
              bidder: bidder,
              params: {
                placementId: id
              }
            });
            elem.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("button")[0].disabled = true;
            document.getElementById("sizesError").innerHTML = "Заполните размеры";
            document.getElementById("sizesError").style.visibility = "visible";
            for (var i = 0; i < generateButtons.length; i += 1) {
              generateButtons[i].disabled = true;
            }
          } else {
            if (main.alphanumeric.test(id)) {
              if (document.getElementById("wrongLetters").style.visibility == "visible") {
                document.getElementById("wrongLetters").style.visibility = "hidden";
              }
              for (var i = 0; i < generateButtons.length; i += 1) {
                generateButtons[i].disabled = false;
              }
              AdUnits.adUnitsUsed[index].bids.push({
                bidder: bidder,
                sizes: [sizes],
                params: {
                  placementId: id
                }
              });
            } else {
              document.getElementById("wrongLetters").innerHTML = "Неподдерживаемые символы в placementId " + bidder;
              document.getElementById("wrongLetters").style.visibility = "visible";
              for (var i = 0; i < generateButtons.length; i += 1) {
                generateButtons[i].disabled = true;
              }
            }
          }
        } else {
          // if (document.getElementById("adUnitError").style.visibility == "visible") {
          //   document.getElementById("adUnitError").style.visibility = "hidden";
          // }
          // AdUnits.bidderState.push({});
          // AdUnits.bidderState[index - 1][bidder] = id;
          if (main.alphanumeric.test(id)) {
            if (document.getElementById("wrongLetters").style.visibility == "visible") {
              document.getElementById("wrongLetters").style.visibility = "hidden";
            }
            for (var i = 0; i < generateButtons.length; i += 1) {
              generateButtons[i].disabled = false;
            }
            AdUnits.adUnitsUsed[index].bids.push({
              bidder: bidder,
              params: {
                placementId: id
              }
            });
          } else {
            document.getElementById("wrongLetters").innerHTML = "Неподдерживаемые символы в placementId " + bidder;
            document.getElementById("wrongLetters").style.visibility = "visible";
            for (var i = 0; i < generateButtons.length; i += 1) {
              generateButtons[i].disabled = true;
            }
          }

        }
      }
    } else {
      console.log(elem.parentNode.parentNode.getElementsBy);
      document.getElementById("adUnitError").innerHTML = bidder + " уже использует такой placementId";
      document.getElementById("adUnitError").style.visibility = "visible";
      for (var i = 0; i < generateButtons.length; i += 1) {
        generateButtons[i].disabled = true;
      }
    }
    elem.parentNode.parentNode.getElementsByClassName("bidder")[0] = true;
  },
  addBidder: function(elem) {
    if (generateButtons[0].disabled && generateButtons[1].disabled) {
      for (var i = 0; i < generateButtons.length; i += 1) {
        generateButtons[i].disabled = false;
      }
    }
    console.log(elem.parentNode.parentNode);
    console.log(main.getPreviousSiblings(elem.parentNode.parentNode).length);
    var index = main.getPreviousSiblings(elem.parentNode.parentNode).length;
    // var index = elem.parentNode.id;
    if (elem.parentNode.getElementsByClassName("bidder").length < Object.keys(biddersMap.campaignIdUsed).length) {
      var code = elem.parentNode.getElementsByClassName("tooltip")[0].getElementsByClassName("code")[0];
      if (code.value !== "") {
        var bidder_element = document.createElement("P");
        bidder_element_inner = '<div class="bidder_row"> <select class="bidder"></select>' +
          '<div class = "tooltip placementIdTooltip">' +
          '<span class="error tooltiptext">Placement ID получается на стороне биддера</span>' +
          '<input class="placementId" placeholder="Placement ID" onfocus="AdUnits.addSizes(this);" oninput="AdUnits.updateBidderElement(this);">' +
          '</div>' +
          '<div class="delete placementDelete" onclick="AdUnits.removeBidder(this);this.parentNode.remove();"></div>';
        bidder_element.innerHTML = bidder_element_inner;
        var x = bidder_element.getElementsByClassName('bidder')[0];
        for (var i = 0; i < Object.keys(biddersMap.campaignIdUsed).length; i++) {
          var option = document.createElement("option");
          option.text = Object.keys(biddersMap.campaignIdUsed)[i];
          if (AdUnits.adUnitsUsed[index].bids == undefined) {
            AdUnits.adUnitsUsed[index].bids = [];
          }
          if (typeof(main.search(AdUnits.adUnitsUsed[index].bids, Object.keys(biddersMap.campaignIdUsed)[i], 'bidder')) == "undefined") {
            x.add(option, x[i]);
          }
        }
        elem.parentNode.insertAdjacentElement('beforeEnd', bidder_element);

      } else {
        document.getElementById("adUnitError").innerHTML = "Заполните containerId";
        document.getElementById("adUnitError").style.visibility = "visible";
        setTimeout(function() {
          document.getElementById("adUnitError").style.visibility = "hidden";
        }, 1500);
      }
    }
  },
  removeBidder: function(elem) {
    var bidder = elem.parentNode.querySelector(".bidder").value;
    // var index = elem.parentNode.parentNode.parentNode.id;
    var index = main.getPreviousSiblings(elem.parentNode.parentNode.parentNode.parentNode).length;
    var bidder = elem.parentNode.getElementsByClassName("bidder")[0].value;
    var arrIndex = AdUnits.adUnitsUsed[index].bids.indexOf(main.search(AdUnits.adUnitsUsed[index].bids, bidder, 'bidder'))
    AdUnits.adUnitsUsed[index].bids.splice(arrIndex, 1);
    if (bidder == "adriver" || bidder == "betweenDigital") {
      elem.parentNode.parentNode.parentNode.getElementsByClassName("sizes")[0].value = "";
      elem.parentNode.parentNode.parentNode.getElementsByClassName("sizes")[0].style.display = "none";
      delete AdUnits.adUnitsUsed[index].sizes;
      if (elem.parentNode.parentNode.parentNode.querySelector("#addBidder").disabled == true) {
        elem.parentNode.parentNode.parentNode.querySelector("#addBidder").disabled = false;
      }
      if (document.getElementById("sizesError").style.visibility == "visible") {
        document.getElementById("sizesError").style.visibility = "hidden";
      }
    }
  }
}
// End AdUnits section

// Begin timeout section

var timeoutInput = {
  timeout: "500",
  checkTimeout: function(elem) {
    var error = document.getElementById("timeoutError");
    if (isNaN(elem.value)) {
      error.innerHTML = "Должны быть цифры";
      elem.classList.add("err");
      elem.focus();
      error.style.visibility = "visible";
    } else if (elem.value.length > 4 || elem.value > 3000) {
      error.innerHTML = "Timeout не должен привышать 3000мс";
      elem.classList.add("err");
      elem.focus();
      error.style.visibility = "visible";
    } else {
      if (error.style.visibility == "visible") {
        error.style.visibility = "hidden";
      }
      if (elem.classList.contains("err")) {
        elem.classList.remove("err");
      }
      this.timeout = elem.value;
    }
  }
};

//End of timeout section

var main = {
  objCount: function(obj) {
    var count = 0;
    for (k in obj)
      if (obj.hasOwnProperty(k)) count++;
    return count;
  },
  getPreviousSiblings: function(el, filter) {
    var siblings = [];
    while (el = el.previousSibling) {
      if (!filter || filter(el)) siblings.push(el);
    }
    return siblings;
  },
  removeFromArray: function(arr) {
    var what, a = arguments,
      L = a.length,
      ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  },
  search: function(array, key, prop) {
    prop = (typeof prop === 'undefined') ? 'name' : prop;
    for (var i = 0; i < array.length; i++) {
      if (array[i][prop] === key) {
        return array[i];
      }
    }
  },
  showSuccess: function() {
    document.getElementById("timeoutError").innerHTML = "Код скопирован в буфер обмена";
    document.getElementById("timeoutError").style.backgroundColor = "green";
    document.getElementById("timeoutError").style.visibility = "visible";
    setTimeout(function() {
      document.getElementById("timeoutError").style.visibility = "hidden";
    }, 1500)
  },
  alphanumeric: /^[0-9a-zA-Z]+$/,
  highlightCode: function() {
    if (document.getElementsByClassName("CodeMirror").length > 0) {
      document.getElementsByClassName("CodeMirror")[0].remove();
    }
    var mixedMode = {
      name: "htmlmixed"
    };
    var editor = CodeMirror.fromTextArea(document.getElementById("result_textarea"), {
      mode: mixedMode,
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      readOnly: true
    });
  },
  createBiddersMap: function() {
    return 'var adfoxBiddersMap = ' + JSON.stringify(biddersMap.campaignIdUsed, null, 4) + ';';
  },
  make: function() {
    var tail = 'var userTimeout = ' + timeoutInput.timeout + ';' + '\n' +
      'window.YaHeaderBiddingSettings = {' + '\n' +
      '    biddersMap: adfoxBiddersMap,' + '\n' +
      '    adUnits: adUnits,' + '\n' +
      '    timeout: userTimeout' + '\n' +
      '};' + '\n' + '</script>';
    var loader = '<script src="https://yastatic.net/pcode/adfox/loader.js" crossorigin="anonymous"' + as + '><\/script>';
    if (document.getElementById("as").checked) {
      var loader = '<script async src="https://yastatic.net/pcode/adfox/loader.js" crossorigin="anonymous"><\/script>';
    } else {
      var loader = '<script src="https://yastatic.net/pcode/adfox/loader.js" crossorigin="anonymous"><\/script>';
    }
    document.getElementById('result_textarea').value = '<script async src="https://yastatic.net/pcode/adfox/header-bidding.js"><\/script>' + '\n' + '<script>' + '\n';
    document.getElementById('result_textarea').value += main.createBiddersMap();
    document.getElementById('result_textarea').value += '\n' + 'var adUnits = ' + JSON.stringify(AdUnits.adUnitsUsed, null, 4) + ';' + '\n' + tail;
    document.getElementById('result_textarea').value += '\n' + loader;
    main.highlightCode();
  },
  makeInstall: function() {
    var bidders = [];
    AdUnits.adUnitsUsed.forEach(function(element) {
      element.bids.forEach(function(item) {
        if (bidders.indexOf(item.bidder) == -1) {
          if (!(item.bidder in biddersMap.campaignIdUsed)) {
            bidders.push(item.bidder);
          }
        }
      });
    });
    if (bidders.length == 0) {
      if (Object.keys(biddersMap.campaignIdUsed).length === 0 && biddersMap.campaignIdUsed.constructor === Object) {
        document.getElementById("generateError").innerHTML = "Заполните Bidders Map";
        document.getElementById("generateError").style.visibility = "visible";
      } else if (AdUnits.adUnitsUsed.length == 0) {
        document.getElementById("fillAdUnits").innerHTML = "Заполните Ad Units";
        document.getElementById("fillAdUnits").style.visibility = "visible";
      } else {
        main.make();
      }
    } else {
      document.getElementById("generateError").innerHTML = "В Bidders Map не добавлены ID кампаний для " + JSON.stringify(bidders).slice(2, -2);;
      document.getElementById("generateError").style.visibility = "visible";
    }

  }
};
