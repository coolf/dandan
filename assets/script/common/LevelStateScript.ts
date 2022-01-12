// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {click, loadScene, setData, turnText} from "../Utils";
import Player from "../Player";
import {playType, scene} from "../config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelStateScript extends cc.Component {


    @property(cc.Node)
    numNode: cc.Node = null;


    private state: boolean = false;
    private num = null;

    onLoad() {
        click(this.node, () => {
            if (!this.state) {
                turnText("此关卡未解锁", new cc.Color(0, 0, 0));
                return;
            }
            // Player.getInstance().level = this.num;
            setData('level', this.num)
            Player.getInstance().playType = playType.game;
            loadScene(scene.Main)
        })
    }


    init(num: number, state: boolean) {
        this.state = state;
        this.num = num;
        if (state) {
            this.node.color = new cc.Color(255, 255, 255)
            this.numNode.color = new cc.Color(147, 147, 147);
        } else {
            this.node.color = new cc.Color(147, 147, 147)
            this.numNode.color = new cc.Color(255, 255, 255)
        }
        this.numNode.getComponent(cc.Label).string = `${num}`;
    }

    start() {
    }


    // update (dt) {}
}
