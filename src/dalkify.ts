import {
    Pack,
    Block
} from "dalkak"

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
    return {
        template: dalkBlock.export(),
        func: dalkBlock.func
    }
}