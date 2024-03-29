let scene = {
    Index: 'Index',
    Main: 'Main',
    Level: 'Level',
    Create: 'Create'

}
let playType = {
    game: 0,
    share: 1
}

// let apiUrl = 'http://0.0.0.0:8088/Api/';
let apiUrl = 'https://dandan.teqiyi.com/Api/';
let levelApi = (level) => `${apiUrl}Level/?level=${level}`;
let ballSpeed = 800;


let blockName = {
    "block_cfx": "矩形",
    "block_lx": "多边形",
    "block_sjx1": "三角形（1）",
    "block_sjx2": "三角形（2）",
    "block_xian": "弹簧线",
    "block_yuan": "圆",
    "block_zfx": "正方形"


}

/**
 * 微信订阅消息ID
 */
let subscribeMessage = ['eU53xiNBELtIzw4nQUm4HNZkQTnjGNopi0OxQpP-gKg'
    , 'aaaGNtUi-j6374l0w2-H9jRsSHRcfOIzSYbOHTfW5xA'
    , 'mPkpMygX1UuMYfYD6YkCZ47U3dtn9pdf8dQXeC17ymQ'];

let blockType = {
    white: 0,
    ban: 1,
    line: 2,
    aimBall: 3
}
export type resBlockType =
    {
        Level: number,
        block: {
            prefab: string,
            x: number,
            y: number,
            rotation: number, // 角度
            rotate: number, // 开启旋转
            scale: number,// 缩放
            float: {
                type: number, // 0 左右移动，1 上下移动
                num: number// 移动距离
            }
        }[],
        banBlock: {
            prefab: string,
            x: number,
            y: number,
            rotation: number,
            rotate: number, // 开启旋转
            scale: number, //缩放,
            float: {
                type: number, // 0 左右移动，1 上下移动
                num: number// 移动距离
            }
        }[]
    }

export {scene, ballSpeed, levelApi, blockType, blockName, apiUrl, playType,subscribeMessage};
