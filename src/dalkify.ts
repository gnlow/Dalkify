import {
    Pack,
    Block,
    Template,
    Type
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
            //console.log(param)
            template = template.replace(Template.addBracket(paramName, param.returnType), `(${paramName})`);
            paramsKeyMap[paramName] = i
            i++;
        }
        console.log(template.split(/[({<)}>]/))
        template.split(/[({<)}>]/).forEach((x, i) => {
            if (x) {
                if (i % 2 == 0) {
                    console.log(blockPointer)
                    blockPointer.params.push({
                        type: "function_field_label",
                        params: [
                            x
                        ]
                    });
                    blockPointer = blockPointer.params[blockPointer.params.length - 1];
                } else {
                    console.log(blockPointer)
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
        if (!Entry.variableContainer.functions_["dalk_" + block.name.key]) {
            Entry.variableContainer.setFunctions([{
                id: "dalk_" + block.name.key,
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
        var func = (object, script) => {
            //script.block.params.forEach((x, i) => {if(params[i]){params[i].value = x.data.params[0]}});
            var objParam = {};
            params.forEach(x => {
                objParam[x.name] = script.getValue(x.name, script);
            });
            return block.func(objParam, {
                platform: "Entry",
                data: {
                    Entry
                }
            });
        }
        Entry.block["func_dalk_" + block.name.key].func = func;
        Entry.block["func_dalk_" + block.name.key].paramsKeyMap = paramsKeyMap;
    });

}