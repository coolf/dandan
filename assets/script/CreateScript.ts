// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {click} from "./Utils";
import {blockName} from "./config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateScript extends cc.Component {


    @property(cc.Node)
    openPanelNode: cc.Node = null;


    @property(cc.Node)
    blockPanelNode: cc.Node = null;
    @property(cc.Node)
    addBlockPanelNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    private openPanelStatus = false;

    private addBlockStatus = false;

    private openPanelIcon = {
        open: null as cc.SpriteFrame,
        close: null as cc.SpriteFrame
    }


    private addBlockBtn: cc.Node = null

    private addBlockTitle: cc.Node = null;


    onLoad() {
        this.addBlockBtn = cc.find('Canvas/addBlockPanel/确定');
        this.addBlockTitle = cc.find('Canvas/addBlockPanel/title');
        cc.resources.loadDir("img/openPanel", cc.SpriteFrame, (err, sp: cc.SpriteFrame[]) => {
            sp.forEach(_ => {
                if (_.name == "btn2") this.openPanelIcon.close = _;
                if (_.name == "btn1") this.openPanelIcon.open = _;
            })
        })
        this.initPanel()

    }

    initPanel() {
        this.blockPanelNode.x = cc.winSize.width / 2 + this.blockPanelNode.width
        // 渐显
        cc.tween(this.openPanelNode)
            .repeatForever(
                cc.tween()
                    .to(1, {opacity: 0})
                    .to(1, {opacity: 255})
            )
            .start()

        click(this.openPanelNode, () => {
            this.pullPanel();
        })

        this.blockPanelNode.children.forEach(btn => {
            click(btn, _ => {
                console.log(blockName[btn.name])
                // this[btn.name]()
                this.pullPanel();
                this.addBlockInfo(btn);
                this.pullAddBlock();
            });
        })


        click(this.addBlockBtn, () => {
            this.pullAddBlock()
        })


    }


    /**
     * 打开关闭 blockList；
     */
    pullPanel() {
        this.openPanelStatus = !this.openPanelStatus;
        if (this.openPanelStatus) {
            cc.tween(this.blockPanelNode)
                .to(0.3, {position: cc.v3(0, 0)})
                .start()
            this.openPanelNode.getComponent(cc.Sprite).spriteFrame = this.openPanelIcon.close;
        } else {
            cc.tween(this.blockPanelNode)
                .to(0.3, {position: cc.v3(cc.winSize.width / 2 + this.blockPanelNode.width, 0)})
                .start()
            this.openPanelNode.getComponent(cc.Sprite).spriteFrame = this.openPanelIcon.open;
        }
    }

    /**
     * 添加block 面板
     */
    pullAddBlock() {
        this.addBlockStatus = !this.addBlockStatus;
        if (this.addBlockStatus) {
            // 显示面板
            cc.tween(this.addBlockPanelNode)
                .to(0.3, {position: cc.v3(0, 0)})
                .start()
        } else {
            cc.tween(this.addBlockPanelNode)
                .to(0.3, {position: cc.v3(-cc.winSize.width / 2 - this.addBlockPanelNode.width, 0)})
                .start()
        }
    }

    addBlockInfo(node: cc.Node) {
        this.addBlockTitle.getComponent(cc.Label).string = `添加一个{${blockName[node.name]}}模块`
    }

    start() {

    }


    // update (dt) {}
}
