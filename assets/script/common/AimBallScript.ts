// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {blockType} from "../config";
import Player from "../Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AimBallScript extends cc.Component {

    private AimBalls: cc.Node = null;
    private ballNum = 9;

    /**
     *
     *  创建瞄准小球球
     *
     *
     */

    onLoad() {
        cc.resources.load('img/ball', cc.SpriteFrame, (err, Asset: cc.SpriteFrame) => {
            this.AimBalls = new cc.Node('AimBalls');
            this.AimBalls.parent = cc.find('Canvas');
            // this.AimBalls.active = false;
            for (let i = 0; i < this.ballNum; i++) {
                let node = new cc.Node('AimBall')
                node.parent = this.AimBalls;
                let sprite = node.addComponent(cc.Sprite);
                sprite.spriteFrame = Asset
                node.color = new cc.Color(0, 0, 0);
                node.width = 12;
                node.height = 12;
                node.group = 'block'
                let RigidBody = node.addComponent(cc.RigidBody);
                RigidBody.type = cc.RigidBodyType.Static;
                let PhysicsCircleCollider = node.addComponent(cc.PhysicsCircleCollider)
                PhysicsCircleCollider.tag = blockType.aimBall;
                PhysicsCircleCollider.radius = 6;
                PhysicsCircleCollider.sensor = true;
                node.x = 0;
                node.y = 0;
                node.zIndex = -10
                node.active = false;
            }
        })

    }

    createBalls(pos: cc.Vec2, startPos: cc.Vec2) {
        // 向量减法
        let distance = pos.sub(startPos);
        for (let i = 0; i < this.AimBalls.children.length; i++) {
            this.AimBalls.children[i].active = true;
            // let startDistance = Player.getInstance().ballNode.width / 2 + this.AimBalls.children[i].width / 2;
            let startDistance = 0;
            this.AimBalls.children[i].setPosition(cc.v2(startDistance + (startPos.x + distance.x / this.ballNum * i), startDistance + (startPos.y + distance.y / this.ballNum * i)))
        }
    }

    hide() {
        for (let i = 0; i < this.AimBalls.children.length; i++) {
            this.AimBalls.children[i].active = false;
        }
    }

    start() {

    }

    // update (dt) {}
}
