
import {realDistanceDiffMin, moveTowardTarget, scriptAttackScript} from "../script/util";

class WaitAndPatrol {
    constructor(target) {
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
                    moveTowardTarget.call(this.father, this.randomTarget, this.speed)
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




const NormalUnit = cc.Class({
    extends: cc.Component,
    ctor: function () {
        console.log('NormalUnit')
        this.targetArr = []
        this.actionArr = [this.checkDead.bind(this), this.checkAttack.bind(this), this.checkRange.bind(this), this.waitAndPatrol.bind(this)]
        this.isInAttackRange = this.isInAttackRange.bind(this)
        this.isInViewRange = this.isInViewRange.bind(this)
    },
    properties: {
        damage: 1, // 攻击力
        attackInterval: 1, // 攻击间隔
        speed: 100, // 移动速度
        viewRange: 100, // 视野范围
        attackRange: 10,
        patrolWaitMaxTime: 1,
        maxHp: 50,
    },

    isInAttackRange(target) {
        const distance = realDistanceDiffMin.call(this, target.node)
        const bool = distance < this.attackRange
        return bool
    },

    isInViewRange(target) {
        const distance = realDistanceDiffMin.call(this, target.node)
        let canSee = distance < this.viewRange
        let canNotAttack = distance > this.attackRange
        return canSee && canNotAttack
    },

    attack(target) {
        // 如果可以攻击
        if (!this.canNotAttack) {
            // 攻击敌人
            scriptAttackScript(this, target)
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
        const target = this.targetArr.find(this.isInAttackRange)
        if (target) {
            this.status = '发现目标，攻击！'
            // 展开攻击 如果攻击成功
            if(this.attack(target)) {
                return true
            }
        }
        return false
    },

    checkRange(dt) {
        // 玩家是否在范围内，重新找到最近的

        const target = this.targetArr.find(this.isInViewRange)

        if (target) {
            this.status = '发现目标，过去！'
            // 移动过去
            moveTowardTarget.call(this, target.node, this.speed)
            return true
        }
    },

    waitAndPatrol(dt) {
        debugger
        // 如果当下有敌人，就返还
        const ifFind = this.targetArr.find((t) => {

            return this.isInViewRange(t) || this.isInAttackRange(t)
        })
        if (ifFind) {
            return true
        }
        this.waitAndPatrolRef = this.waitAndPatrolRef || new WaitAndPatrol(this)
        this.waitAndPatrolRef.run(dt)
    },

    checkDead() {
        if (this.hp < 0) {
            // this.onDestoryCallSpawn()
            this.alive = false
            this.node.destroy()
            return true
        }
    },

    resetSpeed () {
        let lv = this.node.getComponent(cc.RigidBody).linearVelocity
        lv.x = 0
        lv.y = 0
        this.node.getComponent(cc.RigidBody).linearVelocity = lv
    },

    loop(dt) {
        // 侦测可以攻击的目标
        this.actionArr.some((func) => {
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
        this.hp = this.maxHp
        this.waitAndPatrolRef = null
    },

    update (dt) {
        this.resetSpeed()
        this.loop(dt)
    },
})


export default NormalUnit

