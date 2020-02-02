var dalkify = (function (exports, dalkak) {
    'use strict';

    function inject(pack, Entry) {
        var blocks = [];
        for (var block in pack.blocks.value) {
            blocks.push(pack.blocks.value[block]);
        }
        blocks.forEach(function (block) {
            var paramsKeyMap = {};
            var entBlock = {
                type: "function_create",
                params: []
            };
            var blockPointer = entBlock;
            var template = block.template.content;
            var i = 0;
            for (var paramName in block.params.value) { //순서 보장 못함. 수정 필요
                var param = block.params.value[paramName];
                template = template.replace(dalkak.Template.addBracket(paramName, param.returnType), "(" + paramName + ")");
                paramsKeyMap[paramName] = i;
                i++;
            }
            if (block.returnType.name == "string") {
                template += " →(RETURN)";
                paramsKeyMap["RETURN"] = i;
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
                        blockPointer = blockPointer.params[blockPointer.params.length - 1];
                    }
                    else {
                        blockPointer.params.push({
                            type: "function_field_string",
                            params: [{
                                    type: "stringParam_" + Entry.Utils.generateId()
                                }]
                        });
                        blockPointer = blockPointer.params[blockPointer.params.length - 1];
                    }
                }
            });
            //if (!Entry.variableContainer.functions_["dalk_" + block.name]) {
            Entry.variableContainer.setFunctions([{
                    id: "dalk_" + block.name,
                    content: JSON.stringify([
                        [entBlock]
                    ])
                }]);
            //}
            var params = [];
            for (var x in block.params.value) {
                params.push({
                    value: block.params.value[x].run(),
                    type: block.paramTypes.value[x],
                    name: x
                });
            }
            function getProjectVariables(Entry) {
                return Entry.variableContainer.variables_
                    .map(function (val) {
                    var variable = new dalkak.Variable({
                        name: val.getName(),
                        value: val.getValue()
                    });
                    Object.defineProperty(variable, "value", {
                        get: function () {
                            return Entry.variableContainer.getVariableByName(val.getName()).getValue();
                        },
                        set: function (data) {
                            Entry.variableContainer.getVariableByName(val.getName()).setValue(data);
                        },
                    });
                    return variable;
                })
                    .reduce((function (acc, now) {
                    acc[now.name] = now;
                    return acc;
                }), {});
            }
            if (block.returnType.name == "string") {
                var func = function (object, script) {
                    var objParam = {};
                    params.forEach(function (x) {
                        objParam[x.name] = script.getValue(x.name, script);
                    });
                    var RETURN = script.getValue("RETURN", script);
                    if (RETURN && !Entry.variableContainer.getVariableByName(RETURN)) {
                        Entry.variableContainer.addVariable({ name: RETURN });
                    }
                    Entry.variableContainer.getVariableByName(RETURN).setValue(block.func(objParam, new dalkak.Project({
                        variables: getProjectVariables(Entry)
                    }), {
                        Entry: Entry
                    }));
                    return;
                };
            }
            else {
                var func = function (object, script) {
                    var objParam = {};
                    params.forEach(function (x) {
                        objParam[x.name] = script.getValue(x.name, script);
                    });
                    block.func(objParam, new dalkak.Project({
                        variables: getProjectVariables(Entry)
                    }), {
                        Entry: Entry
                    });
                    return;
                };
            }
            Entry.block["func_dalk_" + block.name].func = func;
            Entry.block["func_dalk_" + block.name].paramsKeyMap = paramsKeyMap;
        });
    }

    exports.inject = inject;

    return exports;

}({}, dalkak));
