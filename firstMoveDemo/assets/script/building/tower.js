
import normalUnitAcion from '../unit/normalUnitAcion'
import {realDistanceDiffMin, scriptAttackScript} from "../util";


cc.Class({
    extends: normalUnitAcion,
    ctor: function () {
        this.actionArr = [this.checkAttack.bind(this)]

    },

    properties: {
        forceSelect: 0,
        targetArr: {
            get: function () {
                // 可以根据 forceSelect 来粗暴动态化这个
                switch (this.forceSelect) {
                    case 0:
                        if (window?.global?.player?.getComponent('Player')) {
                            return [window.global.player.getComponent('Player'),  ...window?.global?.alliesRoot?.children?.map((node) => {
                                return node.getComponent('unit')
                            })]
                        } else {
                            return []
                        }
                    case 1:
                        return window?.global?.enemyRoot?.children?.map((node) => {
                            return node.getComponent('unit')
                        }) || []
                    default:
                        return []
                }
            },
        }
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

    checkAttack() {
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

    onDead() {
        this.alive = false
        this.node.destroy()
    },

    // 上面的代码，还没想好怎么组件化
    onLoad () {
        this?.node?.getComponent?.('unit')?.addOnDead(this.onDead.bind(this))
        this.getComponent('bulletLauncher').enabled = false
        const building = this.getComponent('building')
        building?.addOnFinish(() => {
            // 注册完成建造的回调
            this.getComponent('bulletLauncher').enabled = true
        })
    },

    update() {
        this.checkAttack()
    }
});
