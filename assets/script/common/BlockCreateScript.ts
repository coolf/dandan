// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {click, clickEnd, clickMove} from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockCreateScript extends cc.Component {

    private timeList = [];

    onLoad() {
        clickMove(this.node, (_: cc.Event.EventTouch) => {
            this.node.x += _.getDeltaX()
            this.node.y += _.getDeltaY()

        });
        click(this.node, () => {
            var testDate = new Date();
            var time = testDate.getTime();//获取当前时间的毫秒数
            if (this.timeList.length > 0 && (time - this.timeList[0]) / 1000 > 1) {
                this.timeList = [];//1秒内未连续点击
            }
            this.timeList.push(time);
        }, false);


        clickEnd(this.node, () => {
            if (this.timeList.length == 2) {
                this.timeList = [];
                this.node.removeFromParent()
            }
        })


    }

    start() {

    }

    // update (dt) {}
}
