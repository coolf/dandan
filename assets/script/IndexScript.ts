// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {click, clickEnd, getData, loading, loadScene, openWuli, randomNum, setData, wxGame} from "./Utils";
import {levelApi, scene} from "./config";
import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class IndexScript extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    startNode: cc.Node = null;

    @property(cc.Node)
    createNode: cc.Node = null;


    onLoad() {
        Player.getInstance().getShareInfo(); // 获取分享
        openWuli();
        cc.resources.loadDir('prefab');
        cc.resources.loadDir('img');
        cc.resources.loadDir('mp3');
        this.initBall();
        this.initTouch();

        if (getData('openid')) {

            // 走缓存登录
            // console.log(Player.getInstance().openid)
            // console.log(Player.getInstance().level)
            Player.getInstance().webLogin(Player.getInstance().openid);
            if (wxGame) {
                this.wxShareShow();
            }
            return;
        }

        if (wxGame) {
            this.wxShareShow();
            this.wxLogin();
        } else {
            // 游客
            Player.getInstance().webLogin();
        }
    }


    initTouch() {
        // click(this.startNode, () => {
        // })
        clickEnd(this.startNode, () => {
            Player.getInstance().subscribeMessage() //微信订阅
            if (wxGame) {
                // @ts-ignore
                wx.reportEvent("start_game", {})
            }
            loadScene(scene.Level)

        })

        click(this.createNode, () => {
            if (wxGame) {
                // @ts-ignore
                wx.reportEvent("start_create", {})

            }
            loadScene(scene.Create)
        })
    }

    initBall() {
        cc.find('Canvas/bg').children.forEach(_ => {
            if (_.name == 'ball') {
                let rand = randomNum(-350, -300)
                _.getComponent(cc.RigidBody).linearVelocity = cc.v2(rand, rand)
            }
        })
    }


    /**
     * 微信分享显示
     */
    wxShareShow() {
        // @ts-ignore
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
    }


    /**
     * 微信登录保存信息
     */
    wxLogin() {
        let self = this;

        // 获取授权登录
        // @ts-ignore
        wx.login({
            success(res) {
                console.log(res)
                if (res.code) {
                    //发起网络请求
                    Player.getInstance().getOpenId(res);
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }


    // update (dt) {}
}
