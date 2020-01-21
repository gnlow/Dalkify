var dalkify = (function (exports, dalkak) {
    'use strict';

    function inject(pack, Entry) {
        var blocks = [];
        for (var block in pack.blocks.value) {
            blocks.push(pack.blocks.value[block]);
        }
        blocks.forEach(function (block) {
            if (!Entry.variableContainer.functions_["dalk_" + block.name.key]) {
                var convertedBlock = convertBlock(block, Entry);
                Entry.variableContainer.setFunctions([{
                        id: "dalk_" + block.name.key,
                        content: JSON.stringify([
                            [convertedBlock]
                        ])
                    }]);
            }
            var params = [];
            for (var x in block.params.value) {
                params.push({
                    value: block.params.value[x].run(),
                    type: block.paramTypes.value[x],
                    name: x
                });
            }
            var func = function (object, script) {
                script.block.params.forEach(function (x, i) { if (params[i]) {
                    params[i].value = x.data.params[0];
                } });
                var objParam = {};
                params.forEach(function (x) {
                    objParam[x.name] = x.value;
                });
                return block.func(objParam);
            };
            Entry.block["func_dalk_" + block.name.key].func = func;
        });
    }
    function convertBlock(dalkBlock, Entry) {
        var entBlock = {
            type: "function_create",
            params: []
        };
        var blockPointer = entBlock;
        var template = dalkBlock.template.template;
        for (var _i = 0, _a = dalkBlock.params.namespace.names; _i < _a.length; _i++) {
            var paramName = _a[_i];
            var param = dalkBlock.params.value[paramName];
            template = template.replace(dalkak.Template.addBracket(param.name.key, param.returnType), "(" + param.name.key + ")");
        }
        template.split(/[({<)}>]/).forEach(function (x, i) {
            if (x) {
                if (i % 2 == 0) {
                    blockPointer.params.push({
                        type: "function_field_label",
                        params: [
                            x
                        ]
                    });
                    blockPointer = blockPointer.params[0];
                }
                else {
                    blockPointer.params.push({
                        type: "function_field_string",
                        params: [{
                                type: "stringParam_" + Entry.Utils.generateId()
                            }]
                    });
                    blockPointer = blockPointer.params[0];
                }
            }
        });
        return entBlock;
    }

    exports.convertBlock = convertBlock;
    exports.inject = inject;

    return exports;

}({}, dalkak));
