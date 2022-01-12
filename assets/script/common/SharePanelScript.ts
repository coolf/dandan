// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {click, loading, loadScene, requests, setData} from "../Utils";
import {levelApi, playType, scene} from "../config";
import Player from "../Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SharePanelScript extends cc.Component {


    @property(cc.Node)
    okBtn: cc.Node = null;
    @property(cc.Node)
    closeBtn: cc.Node = null;

    onLoad() {
        this.node.active = false;
        click(this.closeBtn, () => {
            cc.tween(this.node)
                .parallel(
                    cc.tween().to(0.3, {opacity: 50}),
                    cc.tween().to(0.3, {scale: 0.3})
                )
                .call(_ => {
                    this.node.removeFromParent()
                })
                .start()
        })
        click(this.okBtn, () => {
            Player.getInstance().playType = playType.share
            loadScene(scene.Main)
        })
    }

    init(uuid) {
        setData('shareId', uuid)
        this.node.active = true;
    }

    // update (dt) {}
}
