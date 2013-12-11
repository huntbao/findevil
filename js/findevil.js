//Find Evil
//author @huntbao
(function(){
    'use strict';

    window.findEvil = {

        __globalVarsNum: 0,

        __duplicatedIdsNum: 0,

        find: function (silent) {
            var t = this;
            t.__findGlobalVars(silent);
            t.__findDuplicatedId(silent);
            if (silent) {
                var totalNum = self.__globalVarsNum + self.__duplicatedIdsNum;
                if (totalNum === 0) return;
                var port = chrome.extension.connect({name: 'find-number'});
                port.postMessage({
                    number: totalNum
                });
            }
        },

        __findGlobalVars: function (silent) {
            var t = this;
            var scriptId = '__findevil__' +  Date.now();
            var scriptSource = '(' + t.__findIds.toString().replace('scriptId', scriptId) + ')();';
            this.__injectScript(scriptSource, scriptId);
            var s = document.querySelectorAll('script[id="' + scriptId + '"]')[0];
            var globalVars = s.getAttribute('gv').split(',');
            document.head.removeChild(s);
            var exVars = ['top', 'window', 'location', 'external', 'chrome', 'document'];
            if (silent) {
                for (var i = 0; i < exVars.length; i++) {
                    var index = globalVars.indexOf(exVars[i]);
                    if (index !== -1) {
                        globalVars.splice(index, 1);
                    }
                }
                self.__globalVarsNum = globalVars.length;
                return;
            }
            self.__globalVarsNum = globalVars.length;
            console.log('%c global vars: ' + globalVars.length, 'background: #000; color: #06e621; padding: 0 5px 0 0; border-radius: 3px;');
            console.log(globalVars);
        },

        __findIds: function () {
            var globalVars = Object.keys(window);
            var s = document.querySelectorAll('script[id="scriptId"]')[0];
            s.setAttribute('gv', globalVars);
        },

        __findDuplicatedId: function (silent) {
            var ids = document.querySelectorAll('*[id]');
            var idsObj = {};
            var duplicatedIds = [];
            var attr;
            for (var i = 0; i < ids.length; i++) {
                attr = ids[i].getAttribute('id');
                idsObj[attr] = idsObj[attr] ? (idsObj[attr] + 1) : 1;
            }
            for(var id in idsObj) {
                if (idsObj[id] > 1) {
                    duplicatedIds.push({
                        name: id,
                        count: idsObj[id]
                    });
                }
            }
            self.__duplicatedIdsNum = duplicatedIds.length;
            if (silent) {
                return;
            }
            console.log('%c duplicated ids: ' + duplicatedIds.length, 'background: #000; color: #06e621; padding: 0 5px 0 0; border-radius: 3px;');
            if (duplicatedIds.length) {
                console.dir(duplicatedIds);
            }
        },

        __injectScript: function (source, id){
            var s = document.createElement('script');
            s.innerHTML = source;
            s.id = id;
            document.head.appendChild(s);
        }
    }
    
})();