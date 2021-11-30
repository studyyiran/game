// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {realDistanceDiffMin} from '../util'

cc.Class({
    extends: cc.Component,

    properties: {
        bombMaxTime: 1000,
        maxSize: 100,
    },

    getDistance () {
        // 获取 player
        const ccNodePlayer = window.global.player
        const ccNodeAi = window.global.ai
        // 计算距离
        if (realDistanceDiffMin.call(this, ccNodePlayer) < 0) {
            window.global.game.gainScore(ccNodePlayer)
            this.whenPickUp()
        }
        if (realDistanceDiffMin.call(this, ccNodeAi) < 0) {
            window.global.game.gainScore(ccNodeAi)
            this.whenPickUp()
        }
    },

    whenPickUp() {
        this.onDead()
    },

    checkHaveBomb(dt) {
        this.bombTime += dt
        this.setSizeByPercent()
    },

    setSizeByPercent() {
        const percent = this.bombTime / this.bombMaxTime
        const size = 50 + this.maxSize * percent
        this.node.width = size
        this.node.height = size
    },

    onDead() {
        this.node.destroy()
        this?.node?.getComponent?.('unit').dead()
    },

    onLoad() {
        this?.node?.getComponent?.('unit').setDeadCondition(() => this.bombTime >= this.bombMaxTime)
        this?.node?.getComponent?.('unit').addOnDead(() => [this.onDead.bind(this)])
    },

    start () {
        this.bombTime = 0
        this.setSizeByPercent()
    },

    update (dt) {
        // 计算距离
        this.getDistance()
        if (this.isTarget) {
            return
        }
        // 计算爆炸倒计时
        this.checkHaveBomb(dt)
    },
});
