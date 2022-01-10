// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {click, getData, loading, loadScene, openWuli, randomNum, setData, wxGame} from "./Utils";
import {levelApi} from "./config";
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
        openWuli();
        cc.resources.loadDir('prefab');
        cc.resources.loadDir('img');
        this.initBall();
        if (wxGame){
            this.wxShareShow();
            this.wxLogin();
        };
        this.initTouch();
    }


    initTouch() {
        click(this.startNode, () => {
            loadScene('Main')
        })

        click(this.createNode, () => {
            loadScene('Create')
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
        if (getData('openid')) {

            // 走缓存登录
            console.log(Player.getInstance().openid)
            console.log(Player.getInstance().level)
            return;
        }


        // 获取授权登录
        // @ts-ignore
        wx.login({
            success(res) {
                console.log(res)
                if (res.code) {
                    //发起网络请求
                    self.getOpenId(res);
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }


    getOpenId(data) {
        loading.start();
        // @ts-ignore
        wx.request({
            method: "POST",
            url: 'https://dandan.teqiyi.com/Api/Login/getOpenid',
            data,
            success(_) {
                loading.stop();
                if (_.data.code == 200) {
                    Player.getInstance().openid = _.data.data.openid;
                    Player.getInstance().level = _.data.data.level

                }
                console.log(_.data.data.openid)
                console.log("登录成功")
            }
        })
    }

    // update (dt) {}
}
