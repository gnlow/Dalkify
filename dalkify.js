var dalkify = (function (exports, dalkak) {
    'use strict';

    function inject(pack, Entry) {
        var blocks = [];
        for (var block in pack.blocks.value) {
            blocks.push(pack.blocks.value[block]);
        }
        /*
        Entry.variableContainer.appendFunctions(
            blocks.map(block => new Entry.Func({
                id: `dalk_${block.name.key}`
            }))
        );
        blocks.forEach(block => Entry.block[`func_dalk_${block.name.key}`] = convertBlock(block, Entry));
        */
        blocks.forEach(function (block) {
            Entry.variableContainer.appendFunctions([{
                    id: "dalk_" + block.name.key
                }]);
            console.log(Entry.block["func_dalk_" + block.name.key]);
            //Entry.do('funcEditStart', block.name.key);
            //Entry.block[`func_dalk_${block.name.key}`] = convertBlock(block, Entry);
            Object.assign(Entry.block["func_dalk_" + block.name.key], convertBlock(block));
            //Entry.do('funcEditEnd', 'save');
        });
    }
    function convertBlock(dalkBlock, Entry) {
        var params = [];
        for (var x in dalkBlock.params.value) {
            params.push({
                value: dalkBlock.params.value[x].run(),
                type: dalkBlock.paramTypes.value[x],
                name: x
            });
        }
        var template = dalkBlock.template.template;
        params.forEach(function (param, i) {
            template = template.replace(dalkak.Template.addBracket(param.name, param.type), "%" + (i + 1));
        });
        var func = function (object, block) {
            block.block.params.forEach(function (x, i) { return params[i].value = x.data.params[0]; });
            var objParam = {};
            params.forEach(function (x) {
                objParam[x.name] = x.value;
            });
            return dalkBlock.func(objParam);
        };
        return {
            template: template,
            func: func,
            params: params.map(function (o) { return ({
                type: "Block",
                accept: o.type.name.key
            }); })
        };
    }

    exports.convertBlock = convertBlock;
    exports.inject = inject;

    return exports;

}({}, dalkak));
