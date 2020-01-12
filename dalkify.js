var dalkify = (function (exports) {
    'use strict';

    function inject(pack, Entry) {
        var blocks = [];
        for (var block in pack.blocks.value) {
            blocks.push(pack.blocks.value[block]);
        }
        Entry.variableContainer.appendFunctions(blocks.map(function (block) { return ({ id: "dalk_" + block.name.key }); }));
        blocks.forEach(function (block) { return Entry.block["func_dalk_" + block.name.key] = convertBlock(block); });
    }
    function convertBlock(dalkBlock) {
        return {
            template: dalkBlock.export(),
            func: dalkBlock.func
        };
    }

    exports.inject = inject;

    return exports;

}({}));
