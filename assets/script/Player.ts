import {alert, getData, getQueryVariable, guid, loading, requests, setData, wxGame} from "./Utils";
import {apiUrl, levelApi, subscribeMessage} from "./config";
import SharePanelScript from "./common/SharePanelScript";

/**
 *
 *
 *
 *  player 单例
 *
 *
 */


export default class Player {
    get levelNum(): number {
        return this._levelNum;
    }

    set levelNum(value: number) {
        this._levelNum = value;
    }

    get openid(): string {
        // return this._openid;
        return getData('openid');
    }

    set openid(value: string) {
        this._openid = value;
        setData('openid', value)

    }

    private static instance: Player;


    public isSendEndBall = false;


    private _openid: string = null

    public level: number = 1;

    private _levelNum: number = null;


    // 游戏玩法
    public playType: number = null;


    /**
     * 实例
     */
    public static getInstance() {
        if (!this.instance) {
            this.instance = new Player();
        }
        return this.instance;
    }

    public CanvasNode(): cc.Node {
        return cc.find('Canvas');
    }

    public ballNode(): cc.Node {
        return cc.find('Canvas/ball');
    }

    /**
     * 获取微信的openid
     * @param data
     */
    public getOpenId(data) {
        loading.start();

        requests.post(apiUrl + 'Login/getOpenid', data, (_) => {
            loading.stop();
            if (_.code == 200) {
                Player.getInstance().openid = _.data.openid;
                Player.getInstance().level = _.data.level;
                Player.getInstance().levelNum = _.data.levelNum;
                // console.log(Player.getInstance().levelNum, 'levelNum')
                setData('level', Player.getInstance().level)
            } else {
                alert("登录失败,请刷新小程序")
            }
        })
    }

    /**
     * web游客登录
     */
    public webLogin(openid = null) {
        loading.start()
        if (!openid) {
            openid = guid()
        }
        requests.post(apiUrl + 'Login/', {
            openid
        }, (_) => {
            loading.stop();
            if (_.code == 200) {
                Player.getInstance().openid = _.data.openid;
                Player.getInstance().level = _.data.level;
                Player.getInstance().levelNum = _.data.levelNum;
                setData('level', Player.getInstance().level)
            } else {
                alert("登录失败,请刷新网页重试")
            }
        })
    }

    /**
     * 下一关
     */
    public nextLevel() {
        let url = apiUrl + 'Level/update';
        let data = {
            openid: this.openid,
            level: this.level
        }
        requests.post(url, data, (_) => {
            // console.log(_);
        })

        // 提交微信排行版
        if (wxGame) {
            // @ts-ignore
            wx.setUserCloudStorage({
                KVDataList: [{
                    key: "level",
                    value: JSON.stringify({
                        "wxgame": {
                            "score": this.level,
                            // "level": this.level,
                            "update_time": new Date().getTime() / 1000
                        }
                    })
                }],
                success: function (res) {
                    console.log('--success res:', res);
                },
                fail: function (res) {
                    console.log('--fail res:', res);
                },
                complete: function (res) {
                    console.log('--complete res:', res);
                },
            })
        }


    }


    /**
     * 保存关卡
     * @param content
     */
    public setLevelContent(content, cb) {
        loading.start();
        let url = apiUrl + 'Level/setLevel'
        let data = {
            openid: this.openid,
            content: content
        }

        requests.post(url, data, _ => {
            loading.stop();
            console.log(_);
            cb(_);
        })
    }

    /**
     * 获取分享info
     */
    public getShareInfo() {
        let this_ = this;
        if (wxGame) {
            // @ts-ignore
            var obj = wx.getLaunchOptionsSync();
            // console.log(obj);
            if (obj.query.uuid) {
                this_.creatSharePanel(obj.query.uuid);
                return;
            }
            // @ts-ignore
            wx.getClipboardData({
                success(res) {
                    // console.log(`复制的东西${res.data}`);
                    if (res.data.indexOf('uuid=') != -1) {
                        this_.creatSharePanel(res.data.replace("uuid=", ""));
                        //清空剪贴板 防止重复调用
                        // @ts-ignore
                        wx.setClipboardData({
                            data: ' ',
                        });
                    }
                }
            })

        } else {
            let uuid = getQueryVariable('uuid');
            if (!uuid) {
                return;
            }

            // console.log(uuid)
            this.creatSharePanel(uuid);
        }
    }

    /**
     * 拉起确认开始游戏面板
     * @param uuid
     * @private
     */
    private creatSharePanel(uuid) {
        requests.get(levelApi(uuid), (_) => {
            if (_.code == 200) {
                cc.resources.load('prefab/sharePanel', cc.Prefab, (err, prefab: cc.Prefab) => {
                    let node = cc.instantiate(prefab)
                    node.parent = this.CanvasNode();
                    node.getComponent(SharePanelScript).init(uuid);
                })
            }
        })
    }

    /**
     * 订阅微信消息
     */
    public subscribeMessage() {
        console.log("微信订阅")
        if (!wxGame) return;
        console.log("微信里面微信订阅")
        // @ts-ignore
        wx.requestSubscribeMessage({
            tmplIds: subscribeMessage,
            success(res) {
                console.log(res)
            },
            fail(res){
                console.log('error')
                console.log(res)
            }
        })
    }

}
