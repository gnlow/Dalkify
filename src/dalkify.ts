import {
    Pack,
    Block,
    Template,
    Type
} from "dalkak"
import { Param } from "dalkak/dist/src/Param";

export function inject(pack: Pack, Entry) {
    let blocks: Array < Block > = [];
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
    blocks.forEach(block => {
            Entry.variableContainer.appendFunctions([{
                id: `dalk_${block.name.key}`
            }]);
            console.log(Entry.block["func_dalk_" + block.name.key])
            //Entry.do('funcEditStart', block.name.key);
            //Entry.block[`func_dalk_${block.name.key}`] = convertBlock(block, Entry);
            Object.assign(Entry.block["func_dalk_" + block.name.key], convertBlock(block, Entry));
            //Entry.do('funcEditEnd', 'save');
    });

}

export function convertBlock(dalkBlock: Block, Entry) {
    var params: {
        value: any,
        type: Type,
        name: string
    }[] = [];
    for(var x in dalkBlock.params.value){
        params.push({
            value: dalkBlock.params.value[x].run(),
            type: dalkBlock.paramTypes.value[x],
            name: x
        });
    }
    var template = dalkBlock.template.template;
    params.forEach((param, i) => {
        template = template.replace(Template.addBracket(param.name, param.type), `%${i+1}`);
    });
    var func = (object, block) => {
        block.block.params.forEach((x, i) => params[i].value = x.data.params[0]);
        var objParam = {};
        params.forEach(x => {
            objParam[x.name] = x.value;
        });
        return dalkBlock.func(objParam);
    }
    return {
        template,
        func,
        params: params.map(o => ({
            type: "Block",
            accept: o.type.name.key
        }))
    }
}