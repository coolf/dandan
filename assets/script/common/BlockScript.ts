// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import {blockType, resBlockType} from "../config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockScript extends cc.Component {
    get blockInfo(): any {
        this._blockInfo.x = this.node.x;
        this._blockInfo.y = this.node.y;
        this._blockInfo.info = this.getPyhCollider().tag;
        this._blockInfo.rotation = this.node.angle;
        // this._blockInfo.scale = this.node.scale;
        this._blockInfo.prefab = this.node.name;
        return this._blockInfo;
    }

    set blockInfo(value: any) {
        this._blockInfo = value;
    }


    // LIFE-CYCLE CALLBACKS:


    private Graphics: cc.Graphics = null;

    @property(cc.SpriteFrame)
    border: cc.SpriteFrame = null;


    private _blockInfo = {
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
    };


    onLoad() {
    }


    start() {
    }


    /**
     * 设置角度
     * @param rotation
     */
    initRotation(rotation: number) {
        this.node.angle = rotation

    }


    /**
     * node 转动
     */
    initRotate() {
        this._blockInfo.rotate = 1;
        cc.tween(this.node.children[0])
            .repeatForever(
                cc.tween().by(0.2, {angle: 30})
            )
            .start()
    }

    /**
     * 上下左右浮动
     * @param float
     */
    initFloat(float) {
        // console.log('float', float)
        this._blockInfo.float = float;
        if (float.type == 0) {
            cc.tween(this.node.children[0])
                .repeatForever(
                    cc.tween()
                        .by(0.5, {position: cc.v3(float.num, 0)})
                        .by(0.5, {position: cc.v3(-float.num, 0)})
                        .by(0.5, {position: cc.v3(-float.num, 0)})
                        .by(0.5, {position: cc.v3(float.num, 0)})
                )
                .start()
        }
        if (float.type == 1) {
            cc.tween(this.node.children[0])
                .repeatForever(
                    cc.tween()
                        .by(0.5, {position: cc.v3(0, float.num)})
                        .by(0.5, {position: cc.v3(0, -float.num)})
                        .by(0.5, {position: cc.v3(0, -float.num)})
                        .by(0.5, {position: cc.v3(0, float.num)})
                )
                .start()
        }
    }

    initScale(scale: number) {
        this._blockInfo.scale = scale;

        this.node.width = this.node.width * scale
        this.node.height = this.node.height * scale
        this.node.children[0].scaleX = scale
        this.node.children[0].scaleY = scale



        if (this.getPyhCollider().tag == blockType.line) {
            this.node.children[1].scaleX = scale
            this.node.children[1].scaleY = scale
        }

    }

    // 设置黑白快
    initType(type: number) {


        // if (this.node.getComponent(cc.PhysicsBoxCollider)) {
        //     this.node.getComponent(cc.PhysicsBoxCollider).tag = type;
        // }
        // if (this.node.getComponent(cc.PhysicsCircleCollider)) {
        //     this.node.getComponent(cc.PhysicsCircleCollider).tag = type;
        // }
        this.getPyhCollider().tag = type;
        if (type == blockType.ban) {
            this.setBlockColor();
        }
    }

    /**
     * 设置黑块块
     */
    setBlockColor() {
        this.node.children[0].color = new cc.Color(0, 0, 0)
    }


    /**
     * 黑块特效
     */
    createBanSize() {
        cc.tween(this.node)
            .to(0.03, {scale: .96})
            .to(0.06, {scale: 1.04})
            .to(0.003, {scale: 1})
            .start();
    }

    /**
     * 白线特效
     */
    createLineEffect() {


        this.node.children[0].active = false;
        this.node.children[1].active = true;
        let anim = this.node.children[1].getComponent(cc.Animation);
        anim.stop();
        anim.play();
        anim.on('finished', () => {
            hide();
        }, this)
        anim.on('stop', () => {
            // hide();
        }, this)

        let self = this;

        function hide() {
            // self.node.children[0].active = false
            self.node.active = false;
        }


    }

    /**
     * 白块
     * 创建外框动效
     */
    createBorder() {

        // @ts-ignore
        // this.getPyhCollider().sensor = true


        let node: cc.Node = null;
        if (this.node.getChildByName('border') == null) {
            node = new cc.Node('border');
            node.parent = this.node;
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = this.border;
            node.width = this.node.width;
            node.height = this.node.height;
        } else {
            node = this.node.getChildByName('border');
        }
        node.active = true;
        node.angle = this.node.children[0].angle;
        this.node.children[0].active = false;
        cc.tween(node)
            //todo {easing: 'cubicInOut'}
            .to(0.4, {scale: 1.3})
            .call(() => {
                node.scale = 1;
                this.node.active = false;
                node.active = false;
            })
            .start();


    }


    /**
     *  获取当前碰撞类型
     */
    getPyhCollider(): cc.PhysicsBoxCollider | cc.PhysicsCircleCollider | cc.PhysicsChainCollider {
        if (this.node.children[0].getComponent(cc.PhysicsBoxCollider)) return this.node.children[0].getComponent(cc.PhysicsBoxCollider)
        if (this.node.children[0].getComponent(cc.PhysicsCircleCollider)) return this.node.children[0].getComponent(cc.PhysicsCircleCollider)
        // if (this.node.getComponent(cc.PhysicsCircleCollider)) return this.node.getComponent(cc.PhysicsCircleCollider)
        if (this.node.children[0].getComponent(cc.PhysicsChainCollider)) return this.node.children[0].getComponent(cc.PhysicsChainCollider)
    }


    /**
     * 创建绘图组建
     */
    init() {
        if (!this.Graphics) {
            let node = new cc.Node()
            this.Graphics = node.addComponent(cc.Graphics)
            node.parent = this.node;
        }
    }


    /**
     * 创建放大边框
     */
    createBorder_bak() {
        // this.Graphics.rect(rect.x, rect.y, rect.width, rect.height);
        let x = -this.node.width / 2;
        let y = -this.node.height / 2;
        let w = this.node.width;
        let h = this.node.width;
        let self = this;
        let sleep = 30;

        // 以秒为单位的时间间隔
        let interval = 0.1;
        // 重复次数
        let repeat = 4;
        // 开始延时
        let delay = 0.1;


        let repeat_num = 0;

        this.schedule(() => {
            self.Graphics.clear();
            repeat_num += 1;
            if (repeat_num == repeat) {
                self.node.active = false;
            }
            self.Graphics.rect(x, y, w, h);
            self.Graphics.stroke();
            // self.node.opacity -= 30;
            x -= sleep;
            y -= sleep;
            w += sleep * 2;
            h += sleep * 2;
        }, interval, repeat, delay);
    }

    // update (dt) {}
}
