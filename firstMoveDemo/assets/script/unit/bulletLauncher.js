
// 可以生成 fire，并按照数值设定速度之类的因素。
// 当有自爆蚊的时候，可以试着把入参调整一下

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
            // TODO 今后如果做自爆蚊，这个 speed 还有 damage 就应该是，用的地方试图传进来，如果没有，我再使用默认值
            moveTowardTarget.call({node: newBulltet}, target, 1000)
            // 设置子弹伤害
            newBulltet.damage = this.getComponent('unit').remoteAttackDamage
            // 添加到节点上
            window.global.bulletRoot.addChild(newBulltet)
        }

    },

    start () {

    },

    update (dt) {
    },
});
