// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NextLevelScript extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    private levelTable: cc.Node = null
    private nextLevelTable: cc.Node = null

    onLoad() {
        this.node.zIndex = 999
        this.levelTable = cc.find('level', this.node)
        this.nextLevelTable = cc.find('next_level', this.node)
    }

    start() {

    }

    show(level: number, cb: Function) {
        this.node.active = true;
        this.nextLevelTable.opacity = 100;
        this.nextLevelTable.getComponent(cc.Label).string = `${level + 1}`
        this.nextLevelTable.x = 0;
        this.nextLevelTable.y = cc.winSize.height / 2 + this.nextLevelTable.height / 2;

        cc.tween(this.nextLevelTable)
            // .to(0.4, {position: cc.v3(0, 0)})
            .parallel(
                cc.tween().to(0.4, {position: cc.v3(0, -this.nextLevelTable.height / 2)})
                    .to(0.2, {position: cc.v3(0, 150)})
                    .to(0.1, {position: cc.v3(0, 0)})
                ,
                cc.tween().to(0.2, {opacity: 255}),

                cc.tween().by(0.2, {scale: -0.3})
                    .by(0.2, {scale: 0.3})
            )
            .delay(0.5)
            .call(() => {
                this.node.active = false;
                cb()
            })
            .start();


        this.levelTable.scale = 0.8;
        this.levelTable.opacity = 0;
        this.levelTable.setPosition(cc.v2(0, 0))
        if (level == 0) {
            this.levelTable.getComponent(cc.Label).string = `Go`;
        } else {
            this.levelTable.getComponent(cc.Label).string = `${level}`
        }
        cc.tween(this.levelTable)
            .parallel(
                cc.tween().to(0.4, {scale: 1}),
                cc.tween().to(0.4, {opacity: 255})
            )
            .to(0.3, {position: cc.v3(0, -cc.winSize.height / 2 - this.levelTable.height / 2)})
            .start()
    }

    // update (dt) {}
}
