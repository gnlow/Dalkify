var dalkify = (function (exports, dalkak) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function inject(pack, Entry, packID) {
        var _this = this;
        var _a, _b, _c;
        if ((_a = pack.on) === null || _a === void 0 ? void 0 : _a.run) {
            Entry.addEventListener("run", pack.on.run);
        }
        if ((_b = pack.on) === null || _b === void 0 ? void 0 : _b.stop) {
            Entry.addEventListener("stop", pack.on.stop);
        }
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
                    id: "dalk__" + packID + "__" + block.name,
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
                var func = function (object, script) { return __awaiter(_this, void 0, void 0, function () {
                    var objParam, RETURN, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                objParam = new dalkak.Dict({});
                                params.forEach(function (x) {
                                    var paramValue = script.getValue(x.name, script);
                                    objParam.value[x.name] = dalkak.Literal.from(paramValue).setParam("input", paramValue);
                                });
                                RETURN = script.getValue("RETURN", script);
                                if (RETURN && !Entry.variableContainer.getVariableByName(RETURN)) {
                                    Entry.variableContainer.addVariable({ name: RETURN });
                                }
                                block.setParams(objParam);
                                _b = (_a = Entry.variableContainer.getVariableByName(RETURN)).setValue;
                                return [4 /*yield*/, block.run(new dalkak.Project({
                                        variables: getProjectVariables(Entry)
                                    }), {
                                        Entry: Entry
                                    })];
                            case 1:
                                _b.apply(_a, [_c.sent()]);
                                return [2 /*return*/];
                        }
                    });
                }); };
            }
            else {
                var func = function (object, script) { return __awaiter(_this, void 0, void 0, function () {
                    var objParam;
                    return __generator(this, function (_a) {
                        objParam = {};
                        params.forEach(function (x) {
                            objParam[x.name] = script.getValue(x.name, script);
                        });
                        block.func(objParam, new dalkak.Project({
                            variables: getProjectVariables(Entry)
                        }), {
                            Entry: Entry
                        });
                        return [2 /*return*/];
                    });
                }); };
            }
            Entry.block["func_dalk__" + packID + "__" + block.name].func = func;
            Entry.block["func_dalk__" + packID + "__" + block.name].paramsKeyMap = paramsKeyMap;
            if (pack.color) {
                Entry.block["func_dalk__" + packID + "__" + block.name].color = "#" + pack.color.toString(16);
                Entry.block["func_dalk__" + packID + "__" + block.name].outerLine = "#00000000";
            }
        });
        if ((_c = pack.on) === null || _c === void 0 ? void 0 : _c.mount) {
            pack.on.mount();
        }
    }

    exports.inject = inject;

    return exports;

}({}, dalkak));
