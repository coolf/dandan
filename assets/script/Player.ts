import {getData, setData} from "./Utils";

/**
 *
 *
 *
 *  player 单例
 *
 *
 */


export default class Player {
    get openid(): string {
        // return this._openid;
        return getData('openid');
    }

    set openid(value: string) {
        this._openid = value;
        setData('openid', value)

    }

    get level(): number {
        // return this._level;
        return parseInt(getData('level'));
    }

    set level(value: number) {
        this._level = value;

        setData('level', value)
    }


    private static instance: Player;


    public isSendEndBall = false;


    private _openid: string = null

    private _level: number = 1;

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

}
