/*

生成：
1）我需要一个刷兵的脚本。
可能 spawn 的生成我要抽离一下


2）我要一个全局命令变更的方案


部队：
1）现在的兵种类型。。。
 我们可以把势力范围，放到 unit 里面，在生成的时候改变。
然后在 attack 的时候，根据 unit 的变量来处理

2）兵种 AI 可以，用一个 actionArr，维护在一个地方。然后。。动态拼接的方式

然后每一个行为，通过一个个脚本，拿出去。
Prefab 通过这些脚本进行拼接

3）死亡等逻辑，默认放到 unit 里面。但是支持重置。


 */
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
        this.isInAttackRange = this.isInAttackRange.bind(this)
        this.isInViewRange = this.isInViewRange.bind(this)
    },

    // 找到攻击范围内的敌人
    isInAttackRange(target) {
        if (!target) {
            return null
        }
        const distance = realDistanceDiffMin.call(this, target.node)
        // 先暂时判断 || 来解决
        const attackRange = this.getComponent('unit').remoteAttackRange || this.getComponent('unit').meleeAttackRange
        const bool = distance < attackRange
        return bool
    },

    // 找到视野范围内的敌人
    isInViewRange(target) {
        if (!target) {
            return null
        }
        const distance = realDistanceDiffMin.call(this, target.node)
        let canSee = distance < this.getComponent('unit').viewRange
        const attackRange = this.getComponent('unit').remoteAttackRange || this.getComponent('unit').meleeAttackRange
        let canNotAttack = distance > attackRange
        // 只有看得到但是打不到的时候，才会触发后续的追踪
        return canSee && canNotAttack
    },

    attack(target) {
        if (!target) {
            return null
        }
        // 如果可以攻击
        if (!this.canNotAttack) {
            if (this.getComponent('unit').meleeAttackDamage) {
                // 近战攻击敌人
                scriptAttackScript(this, target)
            } else if (this.getComponent('unit').remoteAttackDamage) {
                if (this.getComponent('bulletLauncher') && this.getComponent('bulletLauncher').enabled) {
                    // 远程攻击敌人
                    this.getComponent('bulletLauncher').fire(target.node)
                } else {
                    return null
                }

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

    // 超过 2000 就强制跟随
    checkFollowPlayer() {
        const player = window.global.player
        const {speed, birthPlace, orderMode} = this.getComponent('unit')
        if (orderMode === "followPlayer") {
            // 如果距离过远了。
            const distance = realDistanceDiffMin.call(this, player)
            const playerSpeed = player.getComponent('unit').speed
            if (distance > 200) {
                moveTowardTarget.call(this, player, playerSpeed)
                return true
            }
        }
    },

    checkOrderMode() {
        const player = window.global.player
        const {speed, birthPlace, orderMode} = this.getComponent('unit')
        let finalCommand = orderMode
        if (finalCommand && finalCommand !== 'followPlayer' && window.command) {
            finalCommand = 'alliesAttack'
        }
        switch (finalCommand) {
            case 'alliesAttack': {
                // 朝这个节点攻击
                const test = cc.v2(window.global.enemyBirth?.position)
                const distance = realDistanceDiffMin.call(this, {getPosition: () => test})
                // 防抖
                if (distance > 5) {
                    moveTowardTarget.call(this, test, speed)
                }
                return true
            }
            case 'attack': {
                // 移动过去
                // const test = cc.v2(0, 0)
                // const distance = realDistanceDiffMin.call(this, {getPosition: () => test})
                // // 防抖
                // if (distance > 5) {
                //     moveTowardTarget.call(this, birthPlace, speed)
                // }
                moveTowardTarget.call(this, birthPlace, speed)
                return true
            }
            case 'defence': {
                // 移动过去
                const test = birthPlace
                const distance = realDistanceDiffMin.call(this, {getPosition: () => test})
                // 防抖
                if (distance > 5) {
                    moveTowardTarget.call(this, birthPlace, speed)
                }
                return true
            }
            case "followPlayer":
                // 移动过去
                moveTowardTarget.call(this, player, this.getComponent('unit').speed)
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

    // 进攻指定地点
    attackPosition(dt) {
        if (this.getComponent("unit").attackPosition) {

            // TODO 要考虑镜像操作
            let target = this.getComponent("unit").attackPosition

            // 往目标点移动
            moveTowardTarget.call(this, target, this.getComponent('unit').speed)
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
                this.lastAction = func.name
                // 有任何返回 true 了，就清空，因为需要重算巡逻
                this.waitAndPatrolRef = null
                return true
            }
            return false
        })
    },


    onLoad () {
        // console.log('unit onLoad ！！！！')
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

