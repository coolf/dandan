/**
 *
 *
 *
 *  player 单例
 *
 *
 */


export default class Player {


    private static instance: Player;

    // 球球
    public ballNode: cc.Node = cc.find('Canvas/ball');
    public CanvasNode: cc.Node = cc.find('Canvas');


    public isSendEndBall = false;


    public _level: number = 1;

    /**
     * 实例
     */
    public static getInstance() {
        if (!this.instance) {
            this.instance = new Player();
        }
        return this.instance;
    }


}
