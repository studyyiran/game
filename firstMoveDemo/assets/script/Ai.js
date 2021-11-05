// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/zh/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html

import {realDistanceDiffMin, moveTowardTarget} from "./util";

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 1000, // 移动速度
        findClosestMinInterval: 0, // 搜索目标的判定的最小间隔
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    findClosest() {
        // 已有目标 目标未死亡 搜索冷却时间
        if (this.currentClosest && !cc.isValid(this.currentClosest)) {
            this.currentClosest = null
        }
        if (this.cdFindClosest > 0) {
            this.cdFindClosest--
            return
        }
        if (this.currentClosest) {
            return
        }
        // 排序
        const arr = this.spawnRef.timerBomList.sort((a, b) => {
            // 越小的 越靠前
            const dis1 = realDistanceDiffMin.call(this, a)
            const dis2 = realDistanceDiffMin.call(this, b)
            return dis1 - dis2
        })
        // 如果找到最近的敌人
        if (arr?.length) {
            this.currentClosest = arr?.[0]
            // TODO 这种侵入，也让人觉得不舒服
            this.currentClosest.getComponent('TimerBomb').isTarget = true
            this.cdFindClosest = this.findClosestMinInterval
        }
    },

    moveToClosest(dt) {
        // TODO 需要保存在类上，不太适应，更喜欢函数式
        const {currentClosest} = this

        if (!currentClosest) {
            return
        }
        moveTowardTarget.call(this, currentClosest, dt * this.speed)

        // (() => {
            // let angle = this.node.rotation * 2/360 * Math.PI;
            // let dir = cc.v2(Math.sin(angle), Math.cos(angle));
            // dir.normalizeSelf();
            // this.node.x -= dt * dir.x * stepDistance
            // this.node.y -= dt * dir.y * stepDistance
        // })();

        // // 防止摇摆 设置一个最小寻址欲求
        // if (Math.abs(diffX) > stepDistance) {
        //     // 我在右侧 我的 x 正数 我往左移 我要减负
        //     this.node.x = this.node.x + stepDistance * (diffX > 0 ? -1 : 1)
        // } else if (Math.abs(diffY) > stepDistance) {
        //     // 我在上面 我的 y 正数 我往下移 我要减负
        //     this.node.y = this.node.y + stepDistance * (diffY > 0 ? -1 : 1)
        // } else {
        //     console.log('not move')
        // }
    },

    init() {
        this.enabled = true
    },

    // 每次游戏结束，死亡
    dead() {
      this.enabled = false
    },

    onLoad () {
        // console.log(3)
        // 获取全局 spawn 的引用
        this.spawnRef = this.node.parent.getComponent('Game').Spawn.getComponent('Spawn')
    },

    onEnable() {
        // console.log(6)
        // 每次重启游戏，出生
        this.node.setPosition(cc.v2(-100, 0))
    },

    start () {
        // console.log(9)
    },

    update (dt) {
        // console.log('u3')
        this.findClosest()
        this.moveToClosest(dt)
    },
});
