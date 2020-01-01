import {Pack} from "dalkak";

interface EntryCategory {
    category: string
    blocks: string[]
}
interface EntryBlock {
    parent?: string
    color: string
    fontColor?: string
    skeleton: "basic" | "basic_create" | "basic_event" | "basic_loop" | "basic_define" | "pebble_event" | "pebble_loop" | "pebble_basic" | "basic_string_field" | "basic_boolean_field" | "basic_param" | "basic_button" | "basic_without_next" | "basic_double_loop"
    statement?: any[]
    params?: any[]
    events?: object
    def?: object
    paramsKeyMap?: object
    class?: string
    isNotFor?: any[]
    func?: Function
};

const packageToBlock = (module: Pack) => {

};
const addCategory = (category: EntryCategory, Entry, EntryStatic) => {
    var allBlocks = EntryStatic.getAllBlocks();
    EntryStatic.getAllBlocks = () => (allBlocks.push(category), allBlocks);
    return EntryStatic.getAllBlocks();
};
export const loadModule = (module: Pack, Entry, EntryStatic) => {
      var dalkakCategory: EntryCategory = {
        category: "dalkak",
        blocks: []
      };
      Entry.playground.mainWorkspace.blockMenu.setCategoryData(addCategory(dalkakCategory, Entry, EntryStatic));
};

//Entry.EXPANSION_BLOCK_LIST[module.name] = module;
    //Entry.do('objectAddExpansionBlock', module.name);
    /*
    Entry.init(document.getElementsByClassName("workspace")[0], {
        "hashId": Entry.generateHash(),
        "device": null,
        "type": "workspace",
        "fonts": EntryStatic.fonts,
        "libDir": "/lib",
        "textCodingEnable": true,
        "paintMode": "entry-paint"
      });

      Entry.Command.editor.board.code // 다시 init시 이게 null이라서 오류 발생
      */
/*
Entry.init() -> 
Entry.initialize_() ->
this(Entry).playground = new Entry.Playground() ->
this(Entry.Playground).mainWorkspace = new Entry.Workspace(initOpts) ->
this.board = new Entry.Board(option ( == initOpts ) )
Entry.commander.setCurrentEditor('board', this.board);
*/
/*
Entry.init_() -> 
Entry.initialize_() ->
this.commander = new Entry.Commander(this.type, this.doNotSkipAny) ->

Entry.Command.editor = this.editor // command/commander.js
*/

/* class/playground.js
const initOpts = {
    blockMenu: {
        dom: blockMenuView,
        align: 'LEFT',
        categoryData: EntryStatic.getAllBlocks(), // static.js
        scroll: true,
    },
    board: {
        dom: boardView,
    },
    readOnly: Entry.readOnly,
};
*/
// Entry.playground.mainWorkspace.blockMenu

