import {
    Pack,
    Block,
    Template,
    Type,
    Project,
    Variable,
} from "dalkak"

export function inject(pack: Pack, Entry) {
    let blocks: Array < Block > = [];
    for (var block in pack.blocks.value) {
        blocks.push(pack.blocks.value[block]);
    }
    blocks.forEach(block => {
        var paramsKeyMap: {
            [key: string]: any
        } = {};
        var entBlock = {
            type: "function_create",
            params: []
        };
        var blockPointer = entBlock;
        var template = block.template.template;
        var i = 0;
        for (var paramName in block.params.value) { //순서 보장 못함. 수정 필요
            var param = block.params.value[paramName];
            template = template.replace(Template.addBracket(paramName, param.returnType), `(${paramName})`);
            paramsKeyMap[paramName] = i
            i++;
        }
        template.split(/[({<)}>]/).forEach((x, i) => {
            if (x) {
                if (i % 2 == 0) {
                    blockPointer.params.push({
                        type: "function_field_label",
                        params: [
                            x
                        ]
                    });
                    blockPointer = blockPointer.params[blockPointer.params.length - 1];
                } else {
                    blockPointer.params.push({
                        type: "function_field_string",
                        params: [{
                            type: `stringParam_${Entry.Utils.generateId()}`
                        }]
                    });
                    blockPointer = blockPointer.params[blockPointer.params.length - 1];
                }
            }
        });
        if (!Entry.variableContainer.functions_["dalk_" + block.name]) {
            Entry.variableContainer.setFunctions([{
                id: "dalk_" + block.name,
                content: JSON.stringify([
                    [entBlock]
                ])
            }]);
        }
        var params: {
            value: any,
            type: Type,
            name: string
        } [] = [];
        for (var x in block.params.value) {
            params.push({
                value: block.params.value[x].run(),
                type: block.paramTypes.value[x],
                name: x
            });
        }
        function getProjectVariables(Entry){
            return (Entry.variableContainer.getVariableJSON() as Array<any>)
                .map(val => {
                    var variable = new Variable({
                    name: val.name, 
                    value: val.value
                    });
                    Object.defineProperty(variable, "value", {
                        get(){
                            return Entry.variableContainer.getVariableByName(val.name).getValue();
                        },
                        set(data){
                            Entry.variableContainer.getVariableByName(val.name).setValue(data);
                        },
                    });
                    return variable;
                })
                .reduce( ((acc, now) => {
                    acc[now.name] = now;
                    return acc;
                }), {} );
        }
        var func = (object, script) => {
            var objParam = {};
            params.forEach(x => {
                objParam[x.name] = script.getValue(x.name, script);
            });
            return block.func(objParam, 
                new Project({
                    variables: getProjectVariables(Entry)
                }),
                {
                    Entry
                }
            );
        }
        Entry.block["func_dalk_" + block.name].func = func;
        Entry.block["func_dalk_" + block.name].paramsKeyMap = paramsKeyMap;
    });
}