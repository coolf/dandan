/**
 * 点击事件
 * @param node 点击的node
 * @param func 回调函数
 * @param effect 是否开启点击特效
 */
import Texture2D = cc.Texture2D;
import Player from "./Player";

let click = function (node: cc.Node, func: Function, effect: boolean = true): void {
    node.on(cc.Node.EventType.TOUCH_START, (_: cc.Event.EventTouch) => {
        func(_)
        if (effect) {
            specialEffects.bigSmall(node, 0.1, 1.1);
        }
    }, node);
}
/**
 * 点击结束
 * @param node
 * @param func
 */
let clickEnd = (node: cc.Node, func: Function): void => {
    node.on(cc.Node.EventType.TOUCH_END, _ => {
        func(_)
    }, node);
}

/**
 * 点击移动
 * @param node
 * @param func
 */
let clickMove = (node: cc.Node, func: Function): void => {
    node.on(cc.Node.EventType.TOUCH_MOVE, _ => {
        func(_)
    }, node);
}


/**
 * 特效类
 */
let specialEffects = {
    /**
     * 放大缩小
     * @param node 执行node
     * @param time 每次执行时间
     * @param scale 放大倍数
     */
    bigSmall(node: cc.Node, time: number, scale: number): void {
        cc.tween(node)
            .to(time, {scale: scale})
            .to(time, {scale: 1})
            .start()
    },
    /**
     * 上下浮动
     * @param node 执行node
     * @param time 每次执行时间
     * @param distance 距离
     */
    upFloat(node: cc.Node, time: number, distance: number): void {
        cc.tween(node)
            .repeatForever(cc.tween()
                .by(time, {position: cc.v3(0, distance)})
                .by(time, {position: cc.v3(0, -distance)})
                .by(time, {position: cc.v3(0, -distance)})
                .by(time, {position: cc.v3(0, distance)}))
            .start()
    }
}


/**
 * 保存数据
 * @param key
 * @param val
 */
let setData = function (key: string, val: string | number | any) {
    cc.sys.localStorage.setItem(key, val);
}

/**
 * 读取数据
 * @param key
 */
let getData = function (key: string): string {
    return cc.sys.localStorage.getItem(key);
}

/**
 * @param audio 音屏| http 链接
 * @param loop 循环播放
 * @param volume 音量
 * @return audioID 播放音乐ID
 */
let playAudio = function (audio: cc.AudioClip | any, loop: boolean = false, volume: number = 1): number {
    let audioID = 0;
    if (audio._native == '.mp3') {
        audioID = cc.audioEngine.play(audio, loop, volume);
        // if (debug) console.log("audio---->本地---->加载成功");
    } else {
        cc.assetManager.loadRemote(audio, function (err, httpAudio: cc.AudioClip) {
            // if (debug) console.log("audio---->网络---->加载成功");
            audioID = cc.audioEngine.play(httpAudio, loop, volume);
        })
    }
    return audioID
}
/**
 * 关闭播放的音乐
 * @param audioID
 */
let stopAudio = function (audioID: number) {
    cc.audioEngine.stop(audioID);
}

let randomNum = function (minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            // @ts-ignore
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

/**
 * 绑定webView 脚本
 * @param node
 * @param View
 */
let creatWebView = function (node: cc.Node, View: any): cc.WebView {
    // @ts-ignore
    if (node._parent.children[0].name == "Canvas") {
        node = node.children[0]
    }
    let webViewNode = new cc.Node('webViewNode');
    let webView = webViewNode.addComponent(cc.WebView);
    webView.node.width = cc.winSize.width - 10;
    webView.node.height = cc.winSize.height - 10;
    webView.addComponent(View);
    node.addChild(webViewNode);
    webViewNode.x = cc.winSize.width;
    return webView;
}


/**
 * 取cookie
 * @param cname
 */
let getCookie = function (cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

/**
 * 加载场景
 * @param name
 */
let loadScene = function (name: string) {
    cc.director.loadScene(name)
}

/**
 * 预加载场景
 * @param name
 */
let preloadScene = function (name: string) {
    cc.director.preloadScene(name)
}

/**
 * 开启物理系统
 */
let openWuli = function () {
    cc.director.getPhysicsManager().enabled = true;
}


/**
 * 获取当前小时
 */
let getHours = function () {
    return new Date().getHours();
}

/**
 * 获取当前日期
 */
let getLocaleDateString = function () {
    return new Date().toLocaleDateString();
}


/**
 * 滑动进入文字，滑出
 */
let turnText = function (text, color: cc.Color = null) {
    let node: cc.Node = new cc.Node();
    let Lable: cc.Label = node.addComponent(cc.Label);
    if (color) {
        node.color = color
    }
    Lable.string = text
    Lable.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    node.x = -cc.winSize.width / 2;

    cc.tween(node)
        .to(0.5, {position: cc.v3(0, 0)}, {easing: 'quintIn'})
        .to(1.5, {position: cc.v3(0, 0)})
        .to(0.5, {position: cc.v3(cc.winSize.width + node.width, 0)}, {easing: 'quintOut'})
        .call(_ => {
            node.removeFromParent();
        })
        .start()
    node.parent = cc.find('Canvas');
}


/**
 * loading 类
 * 参考 https://www.cnblogs.com/ZerlinM/p/14647721.html
 */
let loading = {
    node: null,
    intervalX: 10, // 间隔
    itemCount: 5, //个数
    start: function () {
        this.getRgbSpriteFrame(((Texture2D: cc.Texture2D) => {

            this.node = new cc.Node('loading');
            this.node.parent = cc.find('Canvas');
            let sprite = this.node.addComponent(cc.Sprite);
            this.node.addComponent(cc.BlockInputEvents);
            let sp = new cc.SpriteFrame(Texture2D);
            sprite.spriteFrame = sp;
            this.node.color = new cc.Color(0, 0, 0);
            this.node.opacity = 100;
            this.node.width = cc.winSize.width;
            this.node.height = cc.winSize.height;
            this.node.x = 0;
            this.node.y = 0;
            this.node.zIndex = 999;
            for (let i = 0; i < this.itemCount; i++) {
                let item: cc.Node = new cc.Node(`item:${i}`);
                let sprite = item.addComponent(cc.Sprite);
                sprite.spriteFrame = sp;
                item.parent = this.node;
                item.color = new cc.Color(30, 144, 255);
                item.width = 15;
                item.height = 80;
                item.x = i * (item.width + this.intervalX) - (this.itemCount * item.width + this.intervalX) / 2;
            }

        }))
        /**
         *  开始loading 效果
         */
        new cc.Component().schedule(() => {
            this.node.children.forEach((_, inx) => {
                const delay = inx * 0.1;
                cc.tween(_)
                    .delay(delay)
                    .to(0.2, {height: 40})
                    .to(0.2, {height: 80})
                    .union()
                    .start()
            })
        }, 1)


    },
    /**
     * 停止
     */
    stop: function () {
        this.node.removeFromParent();
    },
    /**
     * 创建透明单色
     */
    getRgbSpriteFrame: function (cb: Function) {
        // let url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEX///+nxBvIAAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg==';
        // cc.assetManager.loadRemote(url, {ext: '.png'}, (err, Asset: cc.Texture2D) => {
        //     cb(Asset)
        // })

        let texture = new Texture2D();
        texture.initWithData(new Uint8Array([255, 255, 255]), cc.Texture2D.PixelFormat.RGB888, 1, 1);
        cb(texture)

        //
        // let strImg = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEX///+nxBvIAAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg==`
        // let img = new Image();
        // img.src = strImg
        // let texture = new cc.Texture2D();
        // texture.initWithElement(img);
        // texture.handleLoadedTexture();
        // cb(texture)
    }
}

let requests = {
    get(url, cb) {
        fetch(url, {
            "headers": {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: 'GET',
        })
            .then(response => response.json())
            .then(response => {
                cb(response)
            })
    },
    post(url, data, cb) {
        fetch(url, {
            "headers": {
                "Content-Type": "application/json;charset=UTF-8"
            },
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(response => {
                cb(response)
            })
    },
}


let wxGame = cc.sys.platform === cc.sys.WECHAT_GAME;

/**
 * 判断是否debug 模式
 */
let debug = CC_DEBUG;

export {
    click
    , clickEnd
    , clickMove
    , setData
    , getData
    , playAudio
    , debug
    , randomNum
    , creatWebView
    , getCookie
    , stopAudio
    , specialEffects
    , loadScene
    , preloadScene
    , openWuli
    , getHours
    , turnText
    , getLocaleDateString
    , loading
    , requests
    , wxGame
};


