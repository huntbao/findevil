//Find Evil
//author @huntbao
(function(){
    'use strict';
    var findEvil = {

        init: function(){
            var self = this;
            self.initConnect();
            self.browserAction();
            self.createContextMenu();
            chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
                if (changeInfo.status === 'complete') {
                    self.findEvil(true);
                    chrome.browserAction.setBadgeText({text: ''});
                    setInterval(function () {
                        self.findEvil(true);
                    }, 10000);
;                }
            });
        },

        initConnect: function(){
            var self = this;
            chrome.extension.onConnect.addListener(function(port){
                switch(port.name){
                    case 'find-number':
                        self.setBadgeText(port);
                        break;
                    default: 
                        break;
                }
            });
        },

        setBadgeText: function (port) {
            port.onMessage.addListener(function(data){
                chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
                chrome.browserAction.setBadgeText({text: data.number.toString()});
            });
        },

        browserAction: function(){
            var self = this;
            chrome.browserAction.onClicked.addListener(function(tab){
                self.findEvil();
            });
        },

        createContextMenu: function(){
            var self = this;
            chrome.contextMenus.create({
                contexts: ['all'],
                title: chrome.i18n.getMessage('ExtensionName'),
                onclick: function(info, tab){
                    self.findEvil();
                }
            });
        },

        findEvil: function(silent){
            chrome.tabs.executeScript(null, {code: 'findEvil.find(' + silent + ');'});
        }

    }

    document.addEventListener('DOMContentLoaded', function () {
        findEvil.init();
    }, false);

})();