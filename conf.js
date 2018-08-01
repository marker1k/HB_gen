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

 var state = {
     pushed: 0,
     typeError: 0,
     adUnitsAddPushed: 0,
     maxBidders: biddersList.length
 };
 addUi = function() {
     if (document.getElementsByClassName("bidderName").length > 0) {
         var lastBidder = document.getElementsByClassName("bidderName")[document.getElementsByClassName("bidderName").length - 1].value;
         var index = biddersList.indexOf(lastBidder);
         if (index !== -1) {
             biddersList.splice(index, 1);
         }
     }
     var bid_map = document.getElementById("biddersMapInner");
     map_element = document.createElement("DIV");
     map_element.classList.add("bidder_map");
     map_element_inner = '<select class="bidderName"></select>' +
         '<div class="tooltip">' +
         '<span class="tooltiptext">ID кампании биддера из интерфейса ADFOX (уникальный)</span>' +
         '<span class="error">Должно быть заполнено</span>' +
         '<span class="typeError">Должны быть цифры</span>' +
         '<input class="bidderId" type="text" placeholder="ID кампании">' +
         '</div>' +
         '<div class="delete" onclick="onDeleteBidder(this);this.parentNode.remove();"></div>';
     map_element.innerHTML = map_element_inner;
     var x = map_element.getElementsByClassName('bidderName')[0];
     for (var i = 0; i <= biddersList.length - 1; i++) {
         var option = document.createElement("option");
         option.text = biddersList[i];
         x.add(option, x[i]);
     }
     bid_map.insertAdjacentElement("beforeEnd", map_element);
     state.pushed++;
     // if (biddersList.length == 1) {
     //     document.getElementById("addBiddersMapUiElement").disabled = true;
     // }
 }
 addBiddersMapUiElement = function(elem) {
     if (biddersList.length >= 1 && state.typeError === 0 && state.pushed !== state.maxBidders) {
         var nodes = elem.parentNode.querySelectorAll(".bidderId");
         if (state.pushed > 0) {
             if (nodes[nodes.length - 1].value == "") {
                 nodes[nodes.length - 1].parentNode.querySelector(".error").style.visibility = 'visible';
                 return;
             } else if (isNaN(nodes[nodes.length - 1].value) === true) {
                 nodes[nodes.length - 1].parentNode.querySelector(".typeError").style.visibility = 'visible';
                 return;
             } else {
                 if (nodes[nodes.length - 1].parentNode.querySelector(".error").style.visibility === 'visible') {
                     nodes[nodes.length - 1].parentNode.querySelector(".error").style.visibility = 'hidden';
                 }
                 if (nodes[nodes.length - 1].parentNode.querySelector(".typeError").style.visibility === 'visible') {
                     nodes[nodes.length - 1].parentNode.querySelector(".typeError").style.visibility = 'hidden';
                 }
                 addUi();
                 return;
             }
         }
         addUi();
     }


 }
 // checkInput = function(elem, flag) {
 //     elem.addEventListener('blur', function() {
 //         if (isNaN(elem.value) == true && flag == 'number') {
 //             console.log('Должно быть число');
 //             elem.parentNode.querySelector(".typeError").style.visibility = 'visible';
 //             state.typeError = 1;
 //             return;
 //         } else if (isNaN(elem.value) == false && flag == 'string') {
 //             alert('Должна быть строка');
 //         }
 //     }, true);
 // }
 //  onfocus="checkInput(this, \'number\');"

 onDeleteBidder = function(elem) {
     state.pushed--;
     newItem = elem.parentNode.getElementsByClassName("bidderName")[0].value;
     biddersList.indexOf(newItem) === -1 ? biddersList.push(newItem) : console.log("This item already exists");
     if (document.getElementById("addBiddersMapUiElement").disabled == true) {
         document.getElementById("addBiddersMapUiElement").disabled = false;
     }
 }
 addAdUnitsUiElement = function() {
     var bidderIds = document.querySelectorAll(".bidderId");
     if (bidderIds.length === 0) {
         errors.bidderError();
         return;
     } else {
         if (bidderIds[bidderIds.length - 1].value == "") {
             bidderIds[bidderIds.length - 1].parentNode.querySelector(".error").style.visibility = 'visible';
             return;
         } else if (isNaN(bidderIds[bidderIds.length - 1].value) === true) {
             bidderIds[bidderIds.length - 1].parentNode.querySelector(".typeError").style.visibility = 'visible';
             return;
         } else {
             if (bidderIds[bidderIds.length - 1].parentNode.querySelector(".error").style.visibility === 'visible') {
                 bidderIds[bidderIds.length - 1].parentNode.querySelector(".error").style.visibility = 'hidden';
             }
             if (bidderIds[bidderIds.length - 1].parentNode.querySelector(".typeError").style.visibility === 'visible') {
                 bidderIds[bidderIds.length - 1].parentNode.querySelector(".typeError").style.visibility = 'hidden';
             }
             var ad_units = document.getElementById("adUnitsInner");
             units_element = document.createElement("P");
             units_element_inner = '<div class="units_row">' +
                 '<div class="delete adUnitDelete" onclick="this.parentNode.remove();state.adUnitsAddPushed--;document.getElementById(\'addBiddersMapUiElement\').disabled = false;" id="adUnitsCloseButton"></div>' +
                 '<p style="font-size: 15px;color: gray;">ID контейнера ADFOX:</p>' +
                 '<div class="tooltip">' +
                 '<input class="code" placeholder="container ID">' +
                 '<span class="tooltiptext adUnitsTooltip">ID контейнера кода вставки ADFOX (уникальный)</span>' +
                 '<span class="error adUnitsTooltip">Введите ID контейнера</span>' +
                 '</div>' +
                 '<div class="tooltip">' +
                 '<span class="tooltiptext sizesTooltip">Массив массивов: [[Ш,В],[Ш,В]]</span>' +
                 '<input class="sizes" placeholder="Размеры" style="display: none;">' +
                 '<span class="error required">Размеры обязательны для блока с AdRiver или betweenDigital</span>' +
                 '</div> ' +
                 '  <br> <div class="units_bidder"> ' +
                 '</div> ' +
                 '<p style="font-size: 15px;color: gray;">Биддеры и их placement id:</p>' +
                 '<button class="default" id="addBidder" onclick="updateBiddersInUseArray(this);addBidder(this);">Добавить</button>' +
                 '</div>';
             units_element.innerHTML = units_element_inner;
             ad_units.insertAdjacentElement("beforeEnd", units_element);
             state.adUnitsAddPushed++
                 document.getElementById("addBiddersMapUiElement").disabled = true;
         }
     }
 }



 addBidder = function(elem) {
     if (elem.parentNode.querySelector(".code").value === "") {
         errors.containerError(elem);
         return;
     } else if (elem.parentNode.querySelector('.sizes').style.display === 'block' && elem.parentNode.querySelector('.sizes').value === '') {
         console.log('Размеры не заполнены');
     } else {
         if (biddersInUse.length > 0) {
             var bidder_element = document.createElement("P");
             bidder_element_inner = '<div class="bidder_row"> <select class="bidder"></select>' +
                 '<div class = "tooltip placementIdTooltip">' +
                 '<span class="error tooltiptext">Placement ID получается на стороне биддера</span>' +
                 '<input class="placementId" placeholder="Placement ID" onfocus="addSizes(this);">' +
                 '</div>' +
                 '<div class="delete placementDelete" onclick="biddersInUse.push(this.parentNode.querySelector(\'.bidder\').value);this.parentNode.remove();"></div>';
             bidder_element.innerHTML = bidder_element_inner;
             var x = bidder_element.getElementsByClassName('bidder')[0];
             for (var i = 0; i <= biddersInUse.length - 1; i++) {
                 var option = document.createElement("option");
                 option.text = biddersInUse[i];
                 x.add(option, x[i]);
             }
             elem.parentNode.insertAdjacentElement('beforeEnd', bidder_element);
         } else {
             errors.noMoreBidders();
             // console.log('No more bidders in use');
             return;
         }
     }
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
             sizes: JSON.parse("[" + units[i].getElementsByClassName('sizes')[0].value + "]"),
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
     // elemParent.parentNode.querySelector('sizes') != true
     var elemParent = elem.parentNode.parentNode;
     if (elemParent.querySelector('.bidder').value == 'adriver' || elemParent.querySelector('.bidder').value == 'betweenDigital') {
         elemParent.parentNode.parentNode.querySelector('.sizes').style.display = 'block';
         elemParent.parentNode.parentNode.querySelector('.error.required').style.visibility = 'visible';
         setTimeout(function() {
             elemParent.parentNode.parentNode.querySelector('.error.required').style.visibility = 'hidden';
         }, 2000)
     }
     if (elemParent.querySelector('.bidder')) {
         removeA(biddersInUse, elemParent.querySelector('.bidder').value);
     }

 }

 errors = {
     bidderError: function() {
         var elem = document.getElementById("mainError");
         elem.innerText = "Сначала добавьте биддеров";
         elem.style.visibility = 'visible';
         setTimeout(function() {
             elem.style.visibility = 'hidden';
         }, 1000);
     },
     containerError: function(elem) {
         elem.parentNode.querySelector('.error.adUnitsTooltip').style.visibility = 'visible';
         setTimeout(function() {
             elem.parentNode.querySelector('.error.adUnitsTooltip').style.visibility = 'hidden';
         }, 1000);
     },
     placementIdError: function(elem) {
         console.log(elem);
     },
     noMoreBidders: function() {
         var elem = document.getElementById("mainError");
         elem.innerText = "Больше нет биддеров";
         elem.style.visibility = 'visible';
         setTimeout(function() {
             elem.style.visibility = 'hidden';
         }, 1000);
     }
 }

 var errorsCheck = {
     biddersMap: function() {},
     adUnits: function() {},
     timeout: function() {}
 };

 makeInstall = function() {
     var check_results = {
         bidderId: 0,
         code: 0,
         sizes: 0,
         placements: 0
     };
     var bidders_map = document.querySelectorAll('.bidderId');
     var ad_units_container = document.querySelectorAll('.code');
     var ad_units_sizes = document.querySelectorAll('.sizes');
     var plasement_ids = document.querySelectorAll('.placementId');
     for (var i = 0; i < bidders_map.length; i++) {
         if (bidders_map[i] != undefined && bidders_map[i].value === '') {
             check_results.bidderId++;
         }
     }
     for (var x = 0; x < ad_units_container.length; x++) {
         if (ad_units_container[x] != undefined && ad_units_container[x].value === '') {
             check_results.code++;
         }
     }
     for (var i = 0; i < ad_units_sizes.length; i++) {
         if (ad_units_sizes[i] != undefined && ad_units_sizes[i].value === '' && ad_units_sizes[i].style.display === 'block') {
             check_results.sizes++;
         }
     }
     for (var i = 0; i < plasement_ids.length; i++) {
         if (plasement_ids[i] != undefined && plasement_ids[i].value === '') {
             check_results.placements++;
         }
     }

     if (check_results.bidderId == 0 && check_results.code == 0 && check_results.sizes == 0 && check_results.placements == 0 && state.adUnitsAddPushed !== 0 && state.pushed !== 0) {
        document.querySelector(".generate").disabled = "true"
         var tail = 'var userTimeout = ' + document.getElementById("userTimeout").value + ';' + '\n' +
             'window.YaHeaderBiddingSettings = {' + '\n' +
             '    biddersMap: adfoxBiddersMap,' + '\n' +
             '    adUnits: adUnits,' + '\n' +
             '    timeout: userTimeout' + '\n' +
             '};' + '\n' + '</script>';
         loader = '<script src="https://yastatic.net/pcode/adfox/loader.js" crossorigin="anonymous"><\/script>';
         document.getElementById('result_textarea').value = '<script async src="https://yastatic.net/pcode/adfox/header-bidding.js"><\/script>' + '\n' + '<script>' + '\n';
         document.getElementById('result_textarea').value += createBiddersMap();
         makeMap();
         document.getElementById('result_textarea').value += '\n' + 'var adUnits = ' + JSON.stringify(adUnits, null, 4) + ';' + '\n' + tail;
         document.getElementById('result_textarea').value += '\n' + loader;
         highlightCode();
     } else {
        document.getElementById('generateError').style.visibility = 'visible';
        setTimeout(function() {
            document.getElementById('generateError').style.visibility = 'hidden';
        }, 2000);
     }

 }
function highlightCode() {
        var mixedMode = {
            name: "htmlmixed"
        };
        var editor = CodeMirror.fromTextArea(document.getElementById("result_textarea"), {
            mode: mixedMode,
            // lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            readOnly: true
        });
    }


    function getCodeMirrorNative(target) {
        var _target = target;
        if (typeof _target === 'string') {
            _target = document.querySelector(_target);
        }
        if (_target === null || !_target.tagName === undefined) {
            throw new Error('Element does not reference a CodeMirror instance.');
        }

        if (_target.className.indexOf('CodeMirror') > -1) {
            return _target.CodeMirror;
        }

        if (_target.tagName === 'TEXTAREA') {
            return _target.nextSibling.CodeMirror;
        }

        return null;
    };