
import {realDistanceDiffMin, moveTowardTarget, scriptAttackScript} from "../util";

class WaitAndPatrol {
    constructor(target) {
        this.time = 0
        this.status = 'wait'
        this.father = target
    }
    run(dt) {
        switch (this.status) {
            case 'wait':
                if (this.time > this.father.getComponent('unit').patrolWaitMaxTime) {
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
                    // this.father.status = ('巡逻等待' + this.time).slice(0, 8)
                    this.time = this.time + dt
                }
                break;
            case 'move':
                const distance = realDistanceDiffMin.call(this.father, this.randomTarget)
                if (distance > 0) {
                    // this.father.status = '巡逻移动中'
                    // move
                    moveTowardTarget.call(this.father, this.randomTarget, this.father.getComponent('unit').speed)
                } else {
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
        console.log('NormalUnit ctor')
        this.isInAttackRange = this.isInAttackRange.bind(this)
        this.isInViewRange = this.isInViewRange.bind(this)
    },

    // 找到攻击范围内的敌人
    isInAttackRange(target) {
        const distance = realDistanceDiffMin.call(this, target.node)
        // 先暂时判断 || 来解决
        const attackRange = this.getComponent('unit').remoteAttackRange || this.getComponent('unit').meleeAttackRange
        const bool = distance < attackRange
        return bool
    },

    // 找到视野范围内的敌人
    isInViewRange(target) {
        const distance = realDistanceDiffMin.call(this, target.node)
        let canSee = distance < this.getComponent('unit').viewRange
        const attackRange = this.getComponent('unit').remoteAttackRange || this.getComponent('unit').meleeAttackRange
        let canNotAttack = distance > attackRange
        // 只有看得到但是打不到的时候，才会触发后续的追踪
        return canSee && canNotAttack
    },

    attack(target) {
        // 如果可以攻击
        if (!this.canNotAttack) {
            if (this.getComponent('unit').meleeAttackDamage) {
                // 近战攻击敌人
                scriptAttackScript(this, target)
            } else if (this.getComponent('unit').remoteAttackDamage) {
                // 远程攻击敌人
                this.getComponent('bulletLauncher').fire(target.node)
            }

            // 设定 cd
            this.canNotAttack = true
            this.scheduleOnce(() => {
                // 重置 CD
                this.canNotAttack = false
            }, this.getComponent('unit').attackInterval)
            return true
        }
    },

    missThePlayer(dt) {
        const target = this.checkRangeTarget
        const maxIntervalTime = 2 // 最大追寻时间 不易设置的过大，因为，我们并不是时时刻刻更新用户的位置，只记录了最后一次看到他的位置。
        if (this.missThePlayerTimer <= 0) {
            // 重置掉，放掉
            this.missThePlayerTimer = undefined
            return null
        }
        if (target && this.missThePlayerTimer  === undefined && this.lastAction?.includes("checkRange")) {
            this.status = '追丢了，再找一段距离！'
            this.missThePlayerTimer = maxIntervalTime
            return true
        }
        if (target && this.missThePlayerTimer > 0) {
            this.missThePlayerTimer -= dt
            const percent = 1 - Math.pow((1 - this.missThePlayerTimer) / maxIntervalTime, 2)
            // 移动过去
            moveTowardTarget.call(this, target, this.getComponent('unit').speed * percent)
            return true
        }
    },

    checkFollowPlayer() {
        const target = window.global.player
        if (target) {
            this.status = '发现玩家，跟随！'
            // 移动过去
            moveTowardTarget.call(this, target, this.speed)
            return true
        }
    },

    checkAttack() {
        // 玩家是否在范围内，重新找到最近的
        const target = this.targetArr.find(this.isInAttackRange)
        if (target) {
            // 发现目标，攻击！
            // 展开攻击 如果攻击成功
            if(this.attack(target)) {
                return true
            }
            // TODO 由于这块不返回 会导致去 missPlayer 的逻辑，所以我这块还是返回吧，含义就是，只要有敌人，就乖乖呆着，不搞事情
            return true
        }
        return false
    },

    checkRange(dt) {
        // 玩家是否在范围内，重新找到最近的
        const target = this.targetArr.find(this.isInViewRange)

        if (target) {
            // '发现了看得到但打不到的目标，过去！'
            this.checkRangeTarget = {
                x: target.node.x,
                y: target.node.y,
            }
            // 移动过去
            moveTowardTarget.call(this, target.node, this.getComponent('unit').speed)
            return true
        }
    },

    waitAndPatrol(dt) {
        // 如果当下有敌人，就返还  只有在无所事事的时候，才会巡逻
        const ifFind = this.targetArr.find((t) => {
            return this.isInViewRange(t) || this.isInAttackRange(t)
        })
        if (ifFind) {
            return true
        }
        this.waitAndPatrolRef = this.waitAndPatrolRef || new WaitAndPatrol(this)
        this.waitAndPatrolRef.run(dt)
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
                this.lastAction = func.name
                // 有任何返回 true 了，就清空，因为需要重算巡逻
                this.waitAndPatrolRef = null
                return true
            }
            return false
        })
    },

    onDead() {
        this.alive = false
        this.node.destroy()
    },

    onLoad () {
        // 获得玩家。
        this.global = window.global
    },

    start () {
        this.waitAndPatrolRef = null
    },

    update (dt) {
        this.resetSpeed()
        this.loop(dt)
    },
})


export default NormalUnit

