import {alert, getData, getQueryVariable, guid, loading, requests, setData, wxGame} from "./Utils";
import {apiUrl} from "./config";

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
                console.log(Player.getInstance().levelNum, 'levelNum')
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
            console.log(_);
        })
    }


    /**
     * 保存关卡
     * @param content
     */
    public setLevelContent(content, cb) {
        let url = apiUrl + 'Level/setLevel'
        let data = {
            openid: this.openid,
            content: content
        }

        requests.post(url, data, _ => {
            console.log(_);
            cb(_);
        })
    }

    /**
     * 获取分享info
     */
    public getShareInfo() {
        if (wxGame) {
            // @ts-ignore
            var obj = wx.getLaunchOptionsSync();
            console.log(obj);
            if (obj.query.uuid) {
                alert(obj.query.uuid)
            }
        } else {
            getQueryVariable('uuid');
        }
    }

}
