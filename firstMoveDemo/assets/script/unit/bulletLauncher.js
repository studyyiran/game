// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {moveTowardTarget} from "../util";

cc.Class({
    extends: cc.Component,

    properties: {
        bullet: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    fire(target) {
        if (target) {
            // 生成
            const newBulltet = cc.instantiate(this.bullet)
            // 设置原始位置
            newBulltet.setPosition(cc.v2(this.node.x, this.node.y))
            // 设置速度
            moveTowardTarget.call({node: newBulltet}, target, 1000)
            // 添加到节点上
            window.global.enemyBullet.addChild(newBulltet)
        }

    },

    start () {
        this.schedule(() => {
            this.fire(window.global.player)
        }, 1)
    },

    update (dt) {
    },
});
