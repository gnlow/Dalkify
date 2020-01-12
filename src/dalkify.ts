import {
    Pack,
    Block
} from "dalkak"

export function inject(pack: Pack, Entry){
    let blocks: Array<Block> = [];
    for(var block in pack.blocks.value){
        blocks.push(pack.blocks.value[block]);
    }
    Entry.variableContainer.appendFunctions(
        blocks.map( block => ({id: `dalk_${block.name.key}`}) )
    );
    blocks.forEach( block => Entry.block[`func_dalk_${block.name.key}`] =  convertBlock(block) );
}

function convertBlock(dalkBlock: Block){
    return {
        template: dalkBlock.export(),
        func: dalkBlock.func
    }
}