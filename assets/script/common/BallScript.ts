// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BlockScript from "./BlockScript";
import MainScript from "../MainScript";
import Player from "../Player";
import {blockType, playType, scene} from "../config";
import AimBallScript from "./AimBallScript";
import {alert, getData, loadScene, playAudio, setData, wxGame} from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BallScript extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    private MainScript_: MainScript = null;

    onLoad() {
        this.MainScript_ = Player.getInstance().CanvasNode().getComponent(MainScript);

    }

    start() {

    }

    onBeginContact(contact, selfCollider: cc.Collider, otherCollider: cc.Collider) {


        let otherNodeType = this.MainScript_.getBlockTag(otherCollider.node);

        // 解决瞄准小球第一个不消失
        if (this.MainScript_.isTouch && otherNodeType != blockType.aimBall) return;

        //白块
        if (otherNodeType == blockType.white) {
            this.wxVibrateShort();
            // otherCollider.node.getComponent(BlockScript).createBorder();
            cc.resources.load('mp3/白块', cc.AudioClip, (err, mp3: cc.AudioClip) => {
                playAudio(mp3)
            })
            otherCollider.node.parent.getComponent(BlockScript).createBorder();
            this.hideAimBall();
        }
        // 黑块
        if (otherNodeType == blockType.ban) {
            this.wxVibrateShort();
            cc.resources.load('mp3/黑块', cc.AudioClip, (err, mp3: cc.AudioClip) => {
                playAudio(mp3)
            })

            otherCollider.node.parent.getComponent(BlockScript).createBanSize();
            this.hideAimBall();

        }
        //线
        if (otherNodeType == blockType.line) {
            // console.log("线")
            this.wxVibrateShort();
            cc.resources.load('mp3/白块', cc.AudioClip, (err, mp3: cc.AudioClip) => {
                playAudio(mp3)
            })
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
        Player.getInstance().CanvasNode().getComponent(AimBallScript).hide();
    }

    /**
     * 碰到白块震动
     */
    wxVibrateShort(){
        if (wxGame){
            // @ts-ignore
            wx.vibrateShort({
                type:"heavy"
            })

        }
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
                if (Player.getInstance().playType == playType.share) {
                    alert('恭喜您通过成功,2秒后返回首页')
                    this.scheduleOnce(() => {
                        loadScene(scene.Index);
                    }, 2)
                    return;
                }

                console.log("下一关");
                // @ts-ignore


                if (parseInt(getData('level')) == Player.getInstance().level && Player.getInstance().level <= Player.getInstance().levelNum) {
                    Player.getInstance().level++;
                    Player.getInstance().nextLevel();
                }
                let nextLevel = parseInt(getData('level')) + 1;
                setData('level', nextLevel)
                this.MainScript_.nextLevel();
            }
        }
    }
}
