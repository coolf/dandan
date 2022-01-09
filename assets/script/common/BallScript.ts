// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BlockScript from "./BlockScript";
import MainScript from "../MainScript";
import Player from "../Player";
import {blockType} from "../config";
import AimBallScript from "./AimBallScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BallScript extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    private MainScript_: MainScript = null;

    onLoad() {
        this.MainScript_ = Player.getInstance().CanvasNode.getComponent(MainScript);

    }

    start() {

    }

    onBeginContact(contact, selfCollider: cc.Collider, otherCollider: cc.Collider) {


        let otherNodeType = this.MainScript_.getBlockTag(otherCollider.node);

        // 解决瞄准小球第一个不消失
        if (this.MainScript_.isTouch && otherNodeType != blockType.aimBall) return;

        //白块
        if (otherNodeType == blockType.white) {
            // otherCollider.node.getComponent(BlockScript).createBorder();
            otherCollider.node.parent.getComponent(BlockScript).createBorder();
            this.hideAimBall();
        }
        // 黑块
        if (otherNodeType == blockType.ban) {
            otherCollider.node.parent.getComponent(BlockScript).createBanSize();
            this.hideAimBall();
        }
        //线
        if (otherNodeType == blockType.line) {
            console.log("线")
            otherCollider.node.parent.getComponent(BlockScript).createLineEffect();
        }

        // 瞄准球
        if (otherNodeType == blockType.aimBall) {
            otherCollider.node.active = false;
        }
    }


    /**
     * 隐藏瞄准的小球
     */
    hideAimBall() {
        Player.getInstance().CanvasNode.getComponent(AimBallScript).hide();
    }

    update(dt) {
        if (!cc.find('Canvas').getBoundingBox().contains(this.node.parent.convertToWorldSpaceAR(this.node.getPosition()))) {
            // console.log("出界了")
            this.node.x = 0;
            this.node.y = 0;
            this.node.active = false;
            this.MainScript_.setBallLaunch(cc.v2(0, 0));


            if (!this.MainScript_.isSuccess()) {
                this.MainScript_.reSetBlock();
            } else {
                console.log("下一关");
                this.MainScript_.nextLevel();
            }
        }
    }
}
