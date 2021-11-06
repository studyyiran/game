// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {realDistanceDiffMin, moveTowardTarget, nodeAttackScript} from "./util";

class WaitAndPatrol {
    constructor(target) {
        console.log('WaitAndPatrol')
        this.time = 0
        this.maxTime = target.patrolWaitMaxTime
        this.speed = target.speed
        this.status = 'wait'
        this.father = target
    }
    run(dt) {
        switch (this.status) {
            case 'wait':
                if (this.time > this.maxTime) {
                    // 切换状态
                    this.status = 'move'
                    // 重置
                    this.time = 0
                    // 设定
                    const x = this.father.node.x + (Math.random() - 0.5) * 300
                    const y = this.father.node.y + (Math.random() - 0.5) * 300
                    console.log(x)
                    console.log(y)
                    this.randomTarget = {
                        x,
                        y,
                        getPosition: () => cc.v2(x, y),
                        width: 0,
                    };

                } else {
                    this.father.status = ('巡逻等待' + this.time).slice(0, 8)
                    this.time = this.time + dt
                }
                break;
            case 'move':
                const distance = realDistanceDiffMin.call(this.father, this.randomTarget)
                if (distance > 0) {
                    this.father.status = '巡逻移动中'
                    // move
                    moveTowardTarget.call(this.father, this.randomTarget, dt * this.speed)
                } else {
                    console.log('arrive')
                    // 终止状态
                    this.status = 'wait'
                    // 重置
                    this.randomTarget = null
                }
                break;
        }
    }
}


cc.Class({
    extends: cc.Component,
    properties: {
        damage: 1, // 攻击力
        attackInterval: 1, // 攻击间隔
        speed: 100, // 移动速度
        viewRange: 100, // 视野范围
        attackRange: 10,
        patrolWaitMaxTime: 1,
    },

    isInAttackRange(target) {
        const distance = realDistanceDiffMin.call(this, target)
        const bool = distance < this.attackRange
        return bool
    },

    isInViewRange(target) {
      const distance = realDistanceDiffMin.call(this, target)
        let canSee = distance < this.viewRange
        let canNotAttack = distance > this.attackRange
      return canSee && canNotAttack
    },

    attack(target) {
        // 如果可以攻击
        if (!this.canNotAttack) {
            // 攻击敌人
            nodeAttackScript(this, target)
            // 设定 cd
            this.canNotAttack = true
            this.scheduleOnce(() => {
                // 重新寻找下一个目标
                this.canNotAttack = false
            }, this.attackInterval)
            return true
        }
    },

    checkAttack() {
        // 玩家是否在范围内，重新找到最近的
        if (this.isInAttackRange(this.global.player)) {
            this.status = '发现目标，攻击！'
            // 获取到攻击目标
            let attackTarget = this.global.player.getComponent('Player')
            // 展开攻击 如果攻击成功
            if(this.attack(attackTarget)) {
                return true
            }
        }
        return false
    },

    checkRange(dt) {
        // 玩家是否在范围内，重新找到最近的
        if (this.isInViewRange(this.global.player)) {
            this.status = '发现目标，过去！'
            // 移动过去
            moveTowardTarget.call(this, this.global.player, dt * this.speed)
            return true
        }
    },

    waitAndPatrol(dt) {
        // 如果当下有敌人，就返还
        if (this.isInViewRange(this.global.player) || this.isInAttackRange(this.global.player)) {
            return true
        }
        this.waitAndPatrolRef = this.waitAndPatrolRef || new WaitAndPatrol(this)
        this.waitAndPatrolRef.run(dt)
    },

    loop(dt) {
        // 侦测可以攻击的目标
        const arr = [this.checkAttack.bind(this), this.checkRange.bind(this), this.waitAndPatrol.bind(this)]
        arr.some((func) => {
            if (func(dt)) {
                // 有任何返回 true 了，就清空，因为需要重算巡逻
                this.waitAndPatrolRef = null
                return true
            }
            return false
        })
    },

    onLoad () {
        // 获得玩家。
        this.global = window.global
    },

    start () {
    },

    update (dt) {
        this.loop(dt)
    },
});
