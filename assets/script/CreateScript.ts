// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {click} from "./Utils";
import {blockName, blockType, resBlockType} from "./config";
import BlockCreateScript from "./common/BlockCreateScript";
import BlockScript from "./common/BlockScript";

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


    private blockInfo = {
        info: 0,
        prefab: null,
        x: 0,
        y: 0,
        rotation: 0,
        rotate: 0, // 开启旋转
        scale: 1,// 缩放
        float: {
            type: 0, // 0 左右移动，1 上下移动
            num: 0// 移动距离
        }
    }


    onLoad() {
        // 要生成的block 块


        this.addBlockBtn = cc.find('Canvas/addBlockPanel/确定');
        this.addBlockTitle = cc.find('Canvas/addBlockPanel/title');
        cc.resources.loadDir("img/openPanel", cc.SpriteFrame, (err, sp: cc.SpriteFrame[]) => {
            sp.forEach(_ => {
                if (_.name == "btn2") this.openPanelIcon.close = _;
                if (_.name == "btn1") this.openPanelIcon.open = _;
            })
        })
        this.initPanel()


        let saveLevelBtn = cc.find('Canvas/保存关卡信息');
        click(saveLevelBtn, () => {
            this.saveLevelInfo();
        }, false)

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
                // console.log(blockName[btn.name])
                // this[btn.name]()
                this.pullPanel();
                this.addBlockInfo(btn);
                this.pullAddBlock();
            });
        })


        click(this.addBlockBtn, () => {
            // console.log(this.blockInfo)
            this.addBlock();
            this.pullAddBlock();


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
            // 隐藏

            cc.tween(this.addBlockPanelNode)
                .to(0.3, {position: cc.v3(-cc.winSize.width / 2 - this.addBlockPanelNode.width, 0)})
                .call(() => {
                    this.addBlockPanelNode.children.forEach(_ => {
                        if (_.name == 'block') {
                            _.removeFromParent()
                        }
                    })
                })
                .start()
        }
    }

    addBlockInfo(node: cc.Node) {
        // 修改config名字
        this.blockInfo.prefab = node.name;
        // console.log(node.name)

        if (this.blockInfo.prefab == 'block_xian') this.blockInfo.info = blockType.line;

        this.addBlockTitle.getComponent(cc.Label).string = `添加一个{${blockName[node.name]}}模块`
        cc.resources.load('prefab/' + node.name, cc.Prefab, (err, prefab: cc.Prefab) => {
            let node = cc.instantiate(prefab);
            // console.log(node)
            node.name = "block";
            node.parent = this.addBlockPanelNode;
            node.y = this.addBlockPanelNode.height / 2 - 100 - node.height / 2;

        })
    }


    /**
     * 调整block 大小
     * @param s
     */
    createBlockSize(s: cc.Slider) {
        // console.log(s.progress)
        // let node = this.addBlockPanelNode.getChildByName('block')
        let node = this.blockNode();
        if (s.progress > 0.5) {
            node.scale = 1 + (s.progress - 0.5);

        } else {
            node.scale = 1 - (0.5 - s.progress);
        }
        this.blockInfo.scale = node.scale;
    }

    /**
     * 调整颜色，黑白
     * @param s
     */
    createBlockColor(s: cc.Toggle) {
        // let node = this.addBlockPanelNode.getChildByName('block');
        let node = this.blockNode();

        if (s.node.name == 'btn2') {
            node.children[0].color = new cc.Color(0, 0, 0);
            this.blockInfo.info = blockType.ban
        } else {
            node.children[0].color = new cc.Color(255, 255, 255)
            this.blockInfo.info = blockType.white
        }

        /**
         * 线单独处理
         */
        if (this.blockInfo.prefab == 'block_xian') {
            this.blockInfo.info = blockType.white
        }
    }

    /**
     * 是否开启自转
     * @param s
     */
    createRotation(s: cc.Toggle) {
        if (s.node.name == 'btn2') {
            cc.tween(this.blockNode().children[0])
                .repeatForever(
                    cc.tween().by(0.2, {angle: 30})
                )
                .start()
            if (this.blockInfo.prefab == 'block_xian') {
                cc.tween(this.blockNode().children[1])
                    .repeatForever(
                        cc.tween().by(0.2, {angle: 30})
                    )
                    .start()
            }
            this.blockInfo.rotate = 1;
        } else {
            this.blockNode().children[0].stopAllActions();
            this.blockNode().children[0].angle = 0;

            if (this.blockInfo.prefab == 'block_xian') {
                this.blockNode().children[1].stopAllActions();
                this.blockNode().children[1].angle = 0;
            }
            this.blockInfo.rotate = 0;
        }
    }

    /**
     * 设置角度
     * @param s
     */
    createAngle(s: cc.Slider) {
        if (s.progress > 0.5) {
            this.blockNode().children[0].angle = -((s.progress - 0.5) * 360)
            if (this.blockInfo.prefab == 'block_xian') this.blockNode().children[1].angle = -((s.progress - 0.5) * 360)
        } else {
            this.blockNode().children[0].angle = ((0.5 - s.progress) * 360)
            if (this.blockInfo.prefab == 'block_xian') this.blockNode().children[1].angle = ((0.5 - s.progress) * 360)
        }

        this.blockInfo.rotation = this.blockNode().children[0].angle;
    }


    /**
     * 创建左右上下移动
     * @param s
     */
    createFloat(s: cc.Toggle) {
        if (s.node.name == 'btn1') {
            this.blockInfo.float.type = 0
        } else {
            this.blockInfo.float.type = 1
        }
    }

    /**
     * 创建浮动距离
     * @param s
     */
    createFloatNum(s: cc.Slider) {
        this.blockInfo.float.num = s.progress * 150
    }


    /**
     * 更具信息生成到关卡地图
     */
    addBlock() {
        // console.log(this.blockInfo);
        let item = this.blockInfo;
        console.log(item)

        cc.resources.load('prefab/' + this.blockInfo.prefab, cc.Prefab, (err, prefab: cc.Prefab) => {
            // console.log(prefab)

            let node = cc.instantiate(prefab);
            node.name = this.blockInfo.prefab
            node.parent = this.blockParentNode();
            node.addComponent(BlockCreateScript);
            node.getComponent(BlockScript).initType(item.info);
            // node.getComponent(BlockScript).blockInfo = item;
            if (item.rotation) node.getComponent(BlockScript).initRotation(item.rotation)
            if (item.scale) node.getComponent(BlockScript).initScale(item.scale)
            if (item.rotate) node.getComponent(BlockScript).initRotate()
            if (item.float) node.getComponent(BlockScript).initFloat(item.float)
            node.x = item.x;
            node.y = item.y;
            node.scale = 0.7
            cc.tween(node)
                .to(0.2, {scale: 1})
                .start();
            // console.log(node.getComponent(BlockScript).blockInfo)


            /**
             * 添加到父节点后，清空当前节点信息
             */
            this.initAddBlock();
            this.initBlockInfo();
            this.blockNode().removeFromParent();

        })

    }


    /**
     * 获取要生成的node块
     */
    blockNode() {
        return this.addBlockPanelNode.getChildByName('block');
    }


    /**
     * 获取 blockParentNode
     */
    blockParentNode = () => cc.find('Canvas/block_parent');


    /**
     *  初始化block信息
     */
    initBlockInfo = () => this.blockInfo = {
        info: 0,
        prefab: null,
        x: 0,
        y: 0,
        rotation: 0,
        rotate: 0, // 开启旋转
        scale: 1,// 缩放
        float: {
            type: 0, // 0 左右移动，1 上下移动
            num: 0// 移动距离
        }
    }

    /**
     * 初始化面板。单选框
     */
    initAddBlock() {
        cc.find('大小', this.addBlockPanelNode).getComponent(cc.Slider).progress = 0.5;
        cc.find('黑白', this.addBlockPanelNode).children.forEach(_ => {
            if (_.getComponent(cc.Toggle)) _.getComponent(cc.Toggle).isChecked = _.name == 'btn1';
        })
        cc.find('自转', this.addBlockPanelNode).children.forEach(_ => {
            if (_.getComponent(cc.Toggle)) _.getComponent(cc.Toggle).isChecked = _.name == 'btn1';
        })
        cc.find('角度', this.addBlockPanelNode).getComponent(cc.Slider).progress = 0.5;

        cc.find('平移', this.addBlockPanelNode).children.forEach(_ => {
            if (_.getComponent(cc.Toggle)) _.getComponent(cc.Toggle).isChecked = _.name == 'btn1';
        })
        cc.find('平移距离', this.addBlockPanelNode).getComponent(cc.Slider).progress = 0;
    }


    /**
     * 保存关卡信息
     */
    saveLevelInfo() {
        // console.log("保存关卡信息")
        let levelBlockType = {
            block: [],
            banBlock: []
        }
        this.blockParentNode().children.forEach(_ => {
            if (_.getComponent(BlockScript).blockInfo.info == blockType.ban) {
                levelBlockType.banBlock.push(_.getComponent(BlockScript).blockInfo)
            } else {
                levelBlockType.block.push(_.getComponent(BlockScript).blockInfo)

            }
        })
        console.log(JSON.stringify(levelBlockType))
    }

    // update (dt) {}
}
