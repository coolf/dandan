// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";
import LevelStateScript from "./common/LevelStateScript";
import {click, loadScene} from "./Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    // 关卡存放 布局
    @property(cc.Node)
    blockParent: cc.Node = null;
    @property(cc.Node)
    prePageNode: cc.Node = null;
    @property(cc.Node)
    nextPageNode: cc.Node = null;


    private width = 100;
    private w_num = 4;
    private h_num = 6;
    private page = 1;
    private page_num = 0;
    private one_page_num = 24;

    private levelNodePool: cc.NodePool = new cc.NodePool();

    onLoad() {

        this.initTouch()
        this.page_num = Math.ceil(Player.getInstance().levelNum / this.one_page_num);
        console.log(`总页数${this.page_num}`)
        this.setPage();
    }

    start() {

    }

    initTouch() {
        click(this.prePageNode, () => {
            this.page--;
            this.setPage();
        })
        click(this.nextPageNode, () => {
            this.page++;
            this.setPage();
        })
        click(cc.find('Canvas/btn1'), () => {
            loadScene('Index')
        })
    }

    /**
     * 切换关卡
     */
    setPage() {
        this.putLevelNode();
        this.showPage();
        if (this.page <= this.page_num) {
            this.blockParent.width = 490;
            this.blockParent.height = this.width * 7 + 60;
            let startPos: cc.Vec2 = cc.v2(-this.blockParent.width / 2 + this.width / 2, this.blockParent.height / 2 - this.width / 2);
            let wNum = 0;
            let hNum = 0;


            let range = 0;
            if (this.page * this.one_page_num <= Player.getInstance().levelNum) {
                range = this.one_page_num;
            } else {
                range = Player.getInstance().levelNum % this.one_page_num;
            }
            for (let i = 0; i < range; i++) {
                let levelNum = (i + 1) + (this.one_page_num * (this.page - 1));
                if (this.levelNodePool.size() > 0) {
                    let node = this.levelNodePool.get();
                    node.x = startPos.x + (wNum * 130);
                    node.y = startPos.y - (hNum * 130);
                    node.parent = this.blockParent;
                    console.log(`关卡：${levelNum},是否OK：${Player.getInstance().level}`);
                    node.getComponent(LevelStateScript).init(levelNum, levelNum <= Player.getInstance().level);
                    wNum++;
                    if (wNum == 4) {
                        wNum = 0;
                        hNum++;
                    }
                } else {
                    this.getLevelPrefab((_) => {
                        let node = cc.instantiate(_);
                        node.x = startPos.x + (wNum * 130);
                        node.y = startPos.y - (hNum * 130);
                        node.parent = this.blockParent;
                        console.log(`关卡：${levelNum},是否OK：${Player.getInstance().level}`);
                        node.getComponent(LevelStateScript).init(levelNum, levelNum <= Player.getInstance().level);
                        wNum++;
                        if (wNum == 4) {
                            wNum = 0;
                            hNum++;
                        }
                    })
                }

            }


        }
    }

    putLevelNode() {
        for (let i = this.blockParent.children.length - 1; i > 0; i--) {
            let node = this.blockParent.children[i];
            cc.tween(node)
                .parallel(
                    cc.tween().to(0.3, {angle: 360}),
                    cc.tween().to(0.3, {scale: 0.5})
                )
                .call(() => {
                    node.angle = 0;
                    node.scale = 1;
                    this.levelNodePool.put(node);
                })
                .start()
        }

    }


    /**
     * 加载关卡prefab
     * @param cb
     */
    getLevelPrefab(cb: Function) {
        cc.resources.load('prefab/level', cc.Prefab, (err, prefab: cc.Prefab) => {
            cb(prefab);
        })
    }

    /**
     * 显示隐藏分页
     */
    showPage() {
        if (this.page_num == 1) {
            this.prePageNode.active = false;
            this.nextPageNode.active = false;
            return;
        }
        if (this.page == this.page_num && this.page > 1) {
            this.nextPageNode.active = false;
            this.prePageNode.active = true;
        }

        if (this.page == 1) {
            this.prePageNode.active = false;
            if (this.page_num > 1) {
                this.nextPageNode.active = true;
            }
        }


        if (this.page < this.page_num && this.page > 1) {
            this.nextPageNode.active = true;
            this.prePageNode.active = true;
        }
    }

    // update (dt) {}
}
