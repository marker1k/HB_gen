 var biddersList = ["criteo", "adriver", "hpmd", "buzzoola", "myTarget", "facebook", "betweenDigital", "aio", "getintent"];
 biddersInUse = [];
 biddersUsed = [];
 createBiddersInUseArray = function() {
     biddersInUse = [];
     var biddersInUseEl = document.getElementsByClassName('bidderName');
     for (var i = 0; i <= biddersInUseEl.length - 1; i++) {
         biddersInUse.push(biddersInUseEl[i].value);
     }
 }
 removeA = function(arr) {
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
 }
 updateBiddersInUseArray = function(elem) {
     var x = elem.parentNode.getElementsByClassName('bidder');
     if (x.length >= 1) {
         for (var i = 0; i <= x.length - 1; i++) {
             if (biddersInUse.includes(x[i].value)) {
                 removeA(biddersInUse, x[i].value);
                 if (biddersInUse.length == 1 && biddersInUse.includes(biddersInUse[0]) == false) {
                     biddersUsed.push(biddersInUse[0]);
                 }
                 if (biddersInUse.includes(x[i].value) == false) {
                     biddersUsed.push(x[i].value);
                 }

                 console.log(biddersInUse);
             }
         }
     }
 }


 addBiddersMapUiElement = function() {
     var bid_map = document.getElementById("biddersMapInner");
     map_element = document.createElement("DIV");
     map_element.classList.add("bidder_map");
     map_element_inner = '<select class="bidderName"></select> <span class="tooltip" data-tooltip="ID рекламной кампании, созданной на 11 уровне Динамической монетизации для данного покупателя" ><input class="bidderId" placeholder="Campaign ID" onfocus="checkInput(this, \'number\');"></span> <span class="delete" onclick="this.parentNode.remove();"> &#10006; </span>';
     map_element.innerHTML = map_element_inner;
     var x = map_element.getElementsByClassName('bidderName')[0];
     for (var i = 0; i <= biddersList.length - 1; i++) {
         var option = document.createElement("option");
         option.text = biddersList[i];
         x.add(option, x[i]);
     }
     bid_map.insertAdjacentElement("beforeEnd", map_element);
 }
 addAdUnitsUiElement = function() {
     var ad_units = document.getElementById("adUnitsInner");
     units_element = document.createElement("P");
     units_element_inner = '<span style="float: right;padding: 0px 5px;" class="delete" onclick="this.parentNode.remove();" id="adUnitsCloseButton"> &#10006; </button></span><div class="units_row"><input class="code" placeholder="container ID"> <span class="tooltip" data-tooltip="Размеры баннера, обязательный параметр для Soloway и Between Digital" ><input class="sizes" placeholder="Sizes (optional)" style="display: none;"></span>   <br> <div class="units_bidder"> </div> <p style="font-size: 15px;color: gray;">Добавьте покупателей для данного блока</p><button class="default" id="addBidder" onclick="updateBiddersInUseArray(this);this.parentNode.insertAdjacentElement(\'beforeEnd\', addBidder());">Добавить</button> </div>';
     units_element.innerHTML = units_element_inner;
     ad_units.insertAdjacentElement("beforeEnd", units_element);
 }
 addBidder = function() {
     var bidder_element = document.createElement("P");
     bidder_element_inner = '<span class="delete" onclick="this.parentNode.remove();" style="float: right; padding: 0px 5px;"> ✖ </span><div class="bidder_row"> <select class="bidder"></select> <input class="placementId" placeholder="Placement ID" onfocus="addSizes(this); checkInput(this, \'number\');"> </div>';
     bidder_element.innerHTML = bidder_element_inner;
     var x = bidder_element.getElementsByClassName('bidder')[0];
     for (var i = 0; i <= biddersInUse.length - 1; i++) {
         var option = document.createElement("option");
         option.text = biddersInUse[i];
         x.add(option, x[i]);
     }

     return bidder_element;
 }
 createBiddersMap = function() {
     var biddersMap = {};
     var howManyBidder = document.getElementsByClassName("bidderName").length;
     howManyId = document.getElementsByClassName("bidderId").length;
     bidders = document.getElementsByClassName("bidderName");
     ids = document.getElementsByClassName("bidderId");
     if (howManyBidder != howManyId) {
         console.log('Fill in all');
     } else {
         for (var i = 0; i < howManyBidder; i++) {
             biddersMap[bidders[i].value] = ids[i].value;
         }
         var createBiddersMapResult = 'const adfoxBiddersMap = ' + JSON.stringify(biddersMap, null, 4) + ';';
         return createBiddersMapResult;
     }
 }


 var adUnits = [];
 makeMap = function() {

     units = document.getElementsByClassName('units_row');

     for (var i = 0; i <= units.length - 1; i++) {
         adUnits[i] = {
             code: units[i].getElementsByClassName('code')[0].value,
             sizes: [units[i].getElementsByClassName('sizes')[0].value],
             bids: []
         };

     }
     for (var k = 0; k <= adUnits.length - 1; k++) {
         var bidders = units[0].getElementsByClassName('bidder_row');
         for (var z = 0; z <= bidders.length - 1; z++) {
             adUnits[k].bids.push({
                 bidder: units[k].getElementsByClassName('bidder')[z].value,
                 params: {
                     placementId: units[k].getElementsByClassName('placementId')[z].value,
                 }
             });
         }
     }

 }
addSizes = function(elem) {
    if (elem.parentNode.querySelector('option').value == 'adriver' || 'betweenDigital' && elem.parentNode.parentNode.parentNode.querySelector('sizes').style.display == 'none') {
        elem.parentNode.parentNode.parentNode.getElementsByClassName('sizes')[0].style.display = 'block';
    } 
}

checkInput = function(elem, flag) {
    elem.addEventListener('blur', function() {
        if (isNaN(elem.value) == true && flag == 'number') {
            alert('Должно быть число');
        } else if (isNaN(elem.value) == false && flag == 'string') {
            alert('Должна быть строка');
        }
    }, true);
}

 makeInstall = function() {
     var tail = 'var userTimeout = ' + document.getElementById("userTimeout").value + ';' + '\n' +
         'window.YaHeaderBiddingSettings = {' + '\n' +
         '    biddersMap: adfoxBiddersMap,' + '\n' +
         '    adUnits: adUnits,' + '\n' +
         '    timeout: userTimeout' + '\n' +
         '};';
     loader = '<script src="https://yastatic.net/pcode/adfox/loader.js" crossorigin="anonymous"><\/script>';
     document.getElementById('result_textarea').value = '<script async src="https://yastatic.net/pcode/adfox/header-bidding.js"><\/script>' + '\n' + '<script>' + '\n';
     document.getElementById('result_textarea').value += createBiddersMap();
     makeMap();
     document.getElementById('result_textarea').value += '\n' + 'var adUnits = ' + JSON.stringify(adUnits, null, 4) + ';' + '\n' + tail;
     document.getElementById('result_textarea').value += '\n' + loader;
 }