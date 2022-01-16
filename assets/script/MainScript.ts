// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {
    alert,
    click,
    clickEnd,
    clickMove,
    getData,
    loading,
    loadScene,
    openWuli,
    requests,
    setData,
    wxGame
} from "./Utils";
import Player from "./Player";
import {ballSpeed, blockName, blockType, levelApi, playType, resBlockType, scene} from "./config";
import BlockScript from "./common/BlockScript";
import AimBallScript from "./common/AimBallScript";
import EndBallScript from "./common/EndBallScript";
import NextLevelScript from "./common/NextLevelScript";
import GameRecorderScript from "./common/GameRecorderScript";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScript extends cc.Component {

    /**
     * 发射位置
     * @private
     */
    private touch_change = {
        start: null as cc.Vec2,
        end: null as cc.Vec2
    }


    public isTouch = false;

    @property(cc.Node)
    blockParent: cc.Node = null;


    onLoad() {
        openWuli()
        this.blockParent.zIndex = 99;
        this.initTouch();
        this.initScript();

        // loading.start()

    }


    /**
     * 添加脚本
     */
    initScript() {
        //添加瞄准小球脚本
        if (!Player.getInstance().CanvasNode().getComponent(AimBallScript)) {
            Player.getInstance().CanvasNode().addComponent(AimBallScript)
        }

        if (!Player.getInstance().CanvasNode().getComponent(EndBallScript)) {
            Player.getInstance().CanvasNode().addComponent(EndBallScript)
        }
        // if (!Player.getInstance().CanvasNode().getComponent(GameRecorderScript)) {
        if (!Player.getInstance().CanvasNode().getComponent(GameRecorderScript) && wxGame) {
            Player.getInstance().CanvasNode().addComponent(GameRecorderScript)
        }
    }


    /**
     * 点击事件
     */
    initTouch() {
        click(cc.find('Canvas/bg/btn1'), () => {
            loadScene(scene.Level)
        });

        click(this.node, (_: cc.Event.EventTouch) => {
            if (this.isSuccess()) return;


            this.isTouch = true;
            this.reSetBlock();
            Player.getInstance().isSendEndBall = false;
            this.setBallLaunch(cc.v2(0, 0));
            Player.getInstance().ballNode().active = true;
            this.touch_change.start = this.node.convertToNodeSpaceAR(_.getLocation());
            Player.getInstance().ballNode().setPosition(this.touch_change.start);


        }, false)
        clickEnd(this.node, (_: cc.Event.EventTouch) => {
            if (this.isSuccess()) return;
            this.isTouch = false;
            Player.getInstance().isSendEndBall = true;
            this.touch_change.end = this.node.convertToNodeSpaceAR(_.getLocation());
            // 向量长度
            let distance = this.touch_change.end.sub(this.touch_change.start).mag();
            if (distance < 30) {
                Player.getInstance().ballNode().active = false;
                Player.getInstance().CanvasNode().getComponent(AimBallScript).hide();
                return;
            }
            let newPos: cc.Vec2 = new cc.Vec2(this.touch_change.end.x - this.touch_change.start.x, this.touch_change.end.y - this.touch_change.start.y);
            newPos.x = newPos.x / distance * ballSpeed;
            newPos.y = newPos.y / distance * ballSpeed;

            this.setBallLaunch(newPos);
        })
        clickMove(this.node, (_: cc.Event.EventTouch) => {
                if (this.isSuccess()) return;
                if (!this.isTouch) return;
                let pos = this.node.convertToNodeSpaceAR(_.getLocation())
                Player.getInstance().CanvasNode().getComponent(AimBallScript).createBalls(pos, this.touch_change.start);
            }
        )


    }

    /**
     * 加载关卡info
     * @param level
     */
    loadLevelNpc(level: number | string) {
        let self = this;
        if (getData(`level${level}`)) {
            this.setLevelNpc(level);
            // console.log("本地加载")
            return;
        }
        loading.start();
        requests.get(levelApi(level), (_) => {
            loading.stop();
            if (_.code == 200) {
                setData(`level${level}`, _.data.level_content);
                self.setLevelNpc(level)
            } else {
                alert(_.msg);
            }


        })

    }


    /**
     * 加载完创建block
     */
    setLevelNpc(level) {
        let _ = JSON.parse(getData(`level${level}`));
        _.block.forEach(item => {
            cc.resources.load(`prefab/${item.prefab}`, cc.Prefab, (err, prefab: cc.Prefab) => {
                let node = cc.instantiate(prefab);
                // 设置属性  黑白
                node.getComponent(BlockScript).initType(blockType.white)
                if (item.prefab == 'block_xian') {
                    node.getComponent(BlockScript).initType(blockType.line)
                }

                // todo 自定义属性。 后面优化写法
                // 设置旋转角度
                if (item.rotation) node.getComponent(BlockScript).initRotation(item.rotation)
                if (item.scale) node.getComponent(BlockScript).initScale(item.scale)
                if (item.rotate) node.getComponent(BlockScript).initRotate()
                if (item.float) node.getComponent(BlockScript).initFloat(item.float)
                node.parent = this.blockParent;
                node.x = item.x;
                node.y = item.y;
                node.scale = 0.7
                cc.tween(node)
                    .to(0.2, {scale: 1})
                    .start();

            })
        })
        _.banBlock.forEach(item => {
            cc.resources.load(`prefab/${item.prefab}`, cc.Prefab, (err, prefab: cc.Prefab) => {
                let node = cc.instantiate(prefab);
                node.getComponent(BlockScript).initType(blockType.ban)

                // 设置旋转角度
                if (item.rotation) node.getComponent(BlockScript).initRotation(item.rotation)
                if (item.scale) node.getComponent(BlockScript).initScale(item.scale)
                if (item.rotate) node.getComponent(BlockScript).initRotate()
                if (item.float) node.getComponent(BlockScript).initFloat(item.float)
                node.parent = this.blockParent;
                node.x = item.x;
                node.y = item.y;
                node.scale = 0.7
                cc.tween(node)
                    .to(0.2, {scale: 1})
                    .start();
            })
        })

        //
        // this.blockParent.children.forEach(_ => {
        //     cc.tween(_)
        //         .to(0.03, {scale: 1})
        //         .start();
        // })
    }

    /**
     * 未通关显示消失的block
     */
    reSetBlock() {
        //todo 消失未显示。待修复
        this.blockParent.children.forEach(_ => {
            // 未通关显示隐藏的块块
            if (!_.children[0].active && (this.getBlockTag(_) == blockType.white || this.getBlockTag(_) == blockType.line)) {
                if (this.getBlockTag(_) == blockType.white) {
                    _.children[1].stopAllActions();
                    _.children[1].active = false;
                }

                if (this.getBlockTag(_) == blockType.line) {
                    _.children[1].getComponent(cc.Animation).stop();
                    _.children[1].active = false;
                }


                _.scale = 0.8
                _.active = true;
                _.children[0].active = true;
                cc.tween(_)
                    .to(0.3, {scale: 1})
                    .start()
            }


        })


    }


    start() {
        this.nextLevel()
    }


    /**
     * 判断游戏是否结束
     */
    isSuccess() {
        let success = true;
        this.blockParent.children.forEach(_ => {
            if (_.children[0].active && this.getBlockTag(_) != blockType.ban) {
                success = false
            }
        })
        return success;
    }


    /**
     * 设置小球球发射偏移
     * @param pos
     */
    setBallLaunch(pos: cc.Vec2) {
        Player.getInstance().ballNode().getComponent(cc.RigidBody).linearVelocity = pos
    }

    /**
     * 获取node的tag
     * @param node
     */
    getBlockTag(node: cc.Node): number {
        // 兼容瞄准的小球
        if (node.children.length) {
            node = node.children[0]
        }
        if (node.getComponent(cc.PhysicsBoxCollider)) return node.getComponent(cc.PhysicsBoxCollider).tag
        if (node.getComponent(cc.PhysicsCircleCollider)) return node.getComponent(cc.PhysicsCircleCollider).tag
        if (node.getComponent(cc.PhysicsChainCollider)) return node.getComponent(cc.PhysicsChainCollider).tag
    }

    nextLevel() {
        this.blockParent.removeAllChildren();
        if (Player.getInstance().playType == playType.share) {
            // console.log('share')
            this.loadLevelNpc(getData('shareId'));
            return;
        }

        if (parseInt(getData('level')) > Player.getInstance().levelNum) {
            alert("关卡已经全部完成,后面将持续更新");
            return;
        }


        cc.find('Canvas/next_level').getComponent(NextLevelScript).show(parseInt(getData('level')), () => {
            // console.log(Player.getInstance().level)
            this.loadLevelNpc(parseInt(getData('level')))
        })


    }

}
