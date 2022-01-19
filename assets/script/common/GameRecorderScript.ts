// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Asset = cc.Asset;
import Player from "../Player";
import {alert, click, clickEnd, executeOnce, executeOnceDay, toast} from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameRecorderScript extends cc.Component {


    private playNode: cc.Node = null;
    private video = {
        start: null as cc.SpriteFrame,
        play: null as cc.SpriteFrame,
        ing: false
    }

    // 关闭按钮
    private closeVideoShare: cc.Node = null;
    private videoShareTitle: cc.Node = null;
    private videoShare: cc.Node = null;
    private shareBtn = null;


    // @ts-ignore
    private recorder = null;

    // 录制时常
    private writeTime: number = null;

    // private recorder = null;


    onLoad() {
        // @ts-ignore
        this.recorder = wx.getGameRecorder();
        console.log('是否支持录制游戏画面', this.recorder.isFrameSupported())
        console.log('是否支持录制游戏画面的同时也录制音频', this.recorder.isSoundSupported())
        this.closeVideoShare = cc.find('Canvas/videoShare/关闭');
        this.videoShare = cc.find('Canvas/videoShare');
        this.videoShareTitle = cc.find('Canvas/videoShare/title')
        this.videoShare.zIndex = cc.macro.MAX_ZINDEX;
        if (this.recorder.isFrameSupported()) {
            executeOnce('recorder', () => {
                alert('您的手机支持录制对局,点击左上角的录制按钮即可录制分享好友')
            });
            executeOnceDay(() => {
                toast('左上角按钮可以录制视频哦')
            })
            this.initIcon();
        }
        // this.createShareBtn(2222);
    }

    initTouch() {
        click(this.playNode, () => {
            if (this.video.ing) {
                // 录制动作
                this.playAction();

                this.playState();
                this.video.ing = false;
            } else {
                // 录制动作
                this.playAction();
                this.playState();
                this.video.ing = true;
            }
        });

        click(this.closeVideoShare, () => {
            // this.shareBtn.hide();
            // this.videoShare.active = false;
            return;
        })
        clickEnd(this.closeVideoShare, () => {
            this.shareBtn.hide();
            this.videoShare.active = false;
            Player.getInstance().ballNode().active = false;
        })

        // this.recorder.on('start', () => {
        //     console.log("开始录制······")
        // })
        // this.recorder.on('stop', (res) => {
        //     console.log(`对局回放时长: ${res.duration}`);
        //     this.createShareBtn(res.duration);
        // })

    }


    /**
     * 设置图标
     */
    initIcon() {
        cc.resources.loadDir('img/GameRecorder', cc.SpriteFrame, (err, sp: cc.SpriteFrame[]) => {
            sp.forEach(_ => {
                if (_.name == 'sp1') {
                    this.video.start = _;
                } else {
                    this.video.play = _;

                }
            })
            this.createPlayIcon();
        })
    };


    /**
     * 视频播放暂停
     */
    playState() {
        if (this.video.ing) {
            this.recorder.stop().then((res) => {
                this.recorder.off('timeUpdate');
                this.videoShareTitle.getComponent(cc.Label).string = `对局回放时长: ${this.writeTime / 1000}秒`
                // console.log('视频停止录制', new Date().getTime() / 1000);
                // console.log(`对局回放时长: ${this.writeTime}`);
                this.createShareBtn(res.duration);
            });
        } else {
            this.recorder.start({
                hookBgm: false
            }).then((res) => {
                toast('视频开始录制');
                console.log('视频开始录制', new Date().getTime() / 1000);

                if (!res.error.code) {
                    this.recorder.on('timeUpdate', (res) => {
                        // console.log(`视频时长: ${res.currentTime}`);
                        this.writeTime = Math.min(res.currentTime, 60000);
                    });
                } else {
                    alert("录制异常");
                }

            })
        }
    }


    /**
     * 录制暂停动作
     */
    playAction() {
        this.playNode.stopAllActions();
        if (this.video.ing) {
            // 切换播放图标
            this.playNode.getComponent(cc.Sprite).spriteFrame = this.video.start;
            cc.tween(this.playNode)
                .repeatForever(
                    cc.tween().by(0.2, {angle: 15})
                        .by(0.2, {angle: -15})
                        .by(0.2, {angle: -15})
                        .by(0.2, {angle: 15})
                )
                .start();
        } else {
            // 切换播放图片
            this.playNode.getComponent(cc.Sprite).spriteFrame = this.video.play;
            // 录制动作
            cc.tween(this.playNode)
                .repeatForever(
                    cc.tween().to(1, {scale: 0.6})
                        .to(1, {scale: 1})
                )
                .start()
        }
    }

    /**
     * 创建录制暂停node
     */
    createPlayIcon() {
        if (this.playNode != null) return;
        this.playNode = new cc.Node('play');
        let sprite = this.playNode.addComponent(cc.Sprite);
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = this.video.start;
        let widget = this.playNode.addComponent(cc.Widget)
        let parent = Player.getInstance().CanvasNode().getChildByName('bg');
        widget.target = parent;
        widget.isAlignTop = true;
        widget.isAlignLeft = true;
        widget.top = 71.89 + 80;
        widget.left = 52.92;
        this.playNode.parent = parent;
        this.playNode.width = 60;
        this.playNode.height = 60;
        cc.tween(this.playNode)
            .repeatForever(
                cc.tween().by(0.2, {angle: 15})
                    .by(0.2, {angle: -15})
                    .by(0.2, {angle: -15})
                    .by(0.2, {angle: 15})
            )
            .start();
        this.initTouch();

    }


    /**
     *  创建分享按钮。微信组件
     * @param duration
     */
    createShareBtn(duration) {
        try {
            // console.log(cc.find('Canvas/videoShare'))
            this.videoShare.active = true;
        } catch (e) {
            console.log(e)
        }

        if (this.shareBtn) {
            this.shareBtn.show();
            // console.log('shareBtn.show()')
            // return;
        }
        // @ts-ignore
        const res = wx.getSystemInfoSync();
        // @ts-ignore
        this.shareBtn = wx.createGameRecorderShareButton({
            // 样式参数
            style: {
                left: res.windowWidth / 2 - 90,
                top: res.windowHeight / 2 - 25,
                height: 50,
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4,
                iconMarginRight: 16,
                paddingLeft: 1,
                paddingRight: 30,
                backgroundColor: '#000000',

            },
            // 按钮的背景图片
            // image: this.shareImgIcon,
            text: '分享游戏时刻',
            // icon: this.shareImgIcon,
            // 分享参数
            share: {
                // 背景音乐的路径
                // bgm: 'walkin.mp3',
                // timeRange: [[0, duration]],
                timeRange: [[0, 1000 * 60]],
                title: {
                    template: 'default.score',
                },
                button: {
                    template: 'default.play',
                }
            }
        })
        this.shareBtn.show();
    }

    onDisable() {
        if (this.shareBtn) this.shareBtn.hide();
        try {
            this.recorder.abort().then((res) => {
                this.recorder.off('timeUpdate');
            })
        } catch (e) {

        }
    }

    // update (dt) {}
}
