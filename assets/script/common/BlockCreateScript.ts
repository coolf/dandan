// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {click, clickMove} from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockCreateScript extends cc.Component {


    onLoad() {
        clickMove(this.node, (_: cc.Event.EventTouch) => {
            this.node.x += _.getDeltaX()
            this.node.y += _.getDeltaY()

        })
    }

    start() {

    }

    // update (dt) {}
}
