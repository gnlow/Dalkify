var dalkify = (function (exports) {
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
        return {
            template: dalkBlock.export(),
            func: dalkBlock.func
        };
    }

    exports.convertBlock = convertBlock;
    exports.inject = inject;

    return exports;

}({}));
