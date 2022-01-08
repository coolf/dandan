// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "../Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EndBallScript extends cc.Component {

    /**
     *
     *   拖尾小球球
     *
     *
     */

    private EndBalls: cc.Node = null;
    private ballPool: cc.NodePool = new cc.NodePool();
    private num = 0;

    private SpriteFrame: cc.SpriteFrame = null;

    onLoad() {
        this.EndBalls = new cc.Node('EndBalls');
        this.EndBalls.parent = cc.find('Canvas');
        cc.resources.load('img/ball', cc.SpriteFrame, (err, Asset: cc.SpriteFrame) => {
            this.SpriteFrame = Asset;
        })
    }

    setPos(pos) {

        if (!this.SpriteFrame) return;
        let node: cc.Node = null;
        if (this.ballPool.size() > 0) {
            node = this.ballPool.get();
        } else {
            node = new cc.Node();
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = this.SpriteFrame
            node.color = new cc.Color(0, 0, 0);
        }
        node.opacity = 255;
        node.parent = this.EndBalls;
        node.width = 10;
        node.height = 10;
        node.setPosition(pos);
        cc.tween(node)
            .parallel(
                cc.tween().delay(0.7),
                cc.tween().to(0.7, {opacity: 0})
            )
            .call(() => {
                this.ballPool.put(node)
            })
            .start()
    }


    update(dt) {
        this.num++
        if (!(this.num % 2 == 0)) return
        if (!Player.getInstance().isSendEndBall) return;
        if (Player.getInstance().ballNode.active) {
            this.setPos(Player.getInstance().ballNode.position);
        }
    }
}
