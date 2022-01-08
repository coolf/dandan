// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class IndexScript extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let node = cc.find('Canvas/New Node')
        cc.tween(node)
            .repeatForever(
                cc.tween().by(0.2, {angle: 30})
            )
            .start()
    }

    start() {

    }

    // update (dt) {}
}
