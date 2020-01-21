import {
    Pack,
    Block,
    Template,
    Type
} from "dalkak"
import {
    Param
} from "dalkak/dist/src/Param";

export function inject(pack: Pack, Entry) {
    let blocks: Array < Block > = [];
    for (var block in pack.blocks.value) {
        blocks.push(pack.blocks.value[block]);
    }
    blocks.forEach(block => {
        if (!Entry.variableContainer.functions_["dalk_" + block.name.key]) {
            var convertedBlock = convertBlock(block, Entry);
            Entry.variableContainer.setFunctions([{
                id: "dalk_" + block.name.key,
                content: JSON.stringify([
                    [convertedBlock]
                ])
            }]);
        }
        var params: {
            value: any,
            type: Type,
            name: string
        }[] = [];
        for(var x in block.params.value){
            params.push({
                value: block.params.value[x].run(),
                type: block.paramTypes.value[x],
                name: x
            });
        }
        var func = (object, script) => {
            script.block.params.forEach((x, i) => {if(params[i]){params[i].value = x.data.params[0]}});
            var objParam = {};
            params.forEach(x => {
                objParam[x.name] = x.value;
            });
            return block.func(objParam);
        }
        Entry.block["func_dalk_" + block.name.key].func = func;
    });
    
}
export function convertBlock(dalkBlock: Block, Entry) {
    var entBlock = {
        type: "function_create",
        params: []
    };
    var blockPointer = entBlock;
    var template = dalkBlock.template.template;
    for (var paramName of dalkBlock.params.namespace.names) {
        var param = dalkBlock.params.value[paramName];
        template = template.replace(Template.addBracket(param.name.key, param.returnType), `(${param.name.key})`);
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
                blockPointer = blockPointer.params[0];
            } else {
                blockPointer.params.push({
                    type: "function_field_string",
                    params: [{
                        type: `stringParam_${Entry.Utils.generateId()}`
                    }]
                });
                blockPointer = blockPointer.params[0];
            }
        }
    });
    return entBlock;
}