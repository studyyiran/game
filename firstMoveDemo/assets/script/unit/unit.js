
/*
unit 承载大量的通用属性。
处理 死亡 hp 等逻辑


目前是耦合在 unit 上面的。暂时如此把。因为 hp 和 unit 都可存在，也算合理
可以尝试去拓展几个新的建筑物，测试一下 hp 的能力
 */

const unit = cc.Class({
    extends: cc.Component,

    ctor: function () {
        this.init()
        this.deadCondition = () => this.hp <= 0
    },

    properties: {
        speed: 10, // 移动速度
        maxHp: 10, // 最大生命值
        viewRange: 0, // 视野范围
        meleeAttackDamage: 0,
        meleeAttackRange: 0,
        remoteAttackDamage: 0,
        remoteAttackRange: 0,
        attackInterval: 1, // 攻击间隔
        patrolWaitMaxTime: 1, // 目标范围内没有敌人时，每次巡逻的时间
        attackRange: 0,
        hpRecover: 0,
        needHpBar: false
    },

    init: function () {
        if (!this.onDeadArr && this?.node?.destroy) {
            this.onDeadArr = [() => this.node.destroy()]
        }
    },

    setDeadCondition(fn) {
        this.deadCondition = fn
    },

    // LIFE-CYCLE CALLBACKS:
    addOnDead(fn) {
        this.onDeadArr = fn(this.onDeadArr)
    },

    checkDead() {
        if (this.deadCondition() && this.status) {
            this.status = false
            this.onDeadArr.map(fn => fn())
        }
    },

    dead() {
      if (this.status) {
          this.status = false
          this.onDeadArr.map(fn => fn())
      }
    },

    onLoad () {
        // 初始化死亡逻辑
        this.init()
        this.hp = this.maxHp
        this.status = true

        // 这让我们勾选一下，就有血条功能。
        // 而且 onDead 的初始化值，让我们连 dead 都省掉了。nice
        if (this.needHpBar) {
            // 创建节点
            // var node = new cc.Node("hpBar");
            // this.node.addComponent(cc.ProgressBar)

            // 使用预设生成节点
            const node = cc.instantiate(window.global.uiPrefab.hpBar);
            node.parent = this.node
        }
        // 如果有 hp 节点，就根据 Node 的宽高进行位置初始化
        this.hpProgressNode = this.node.getChildByName('hpBar')
        if (this.hpProgressNode) {
            this.hpProgress = this.hpProgressNode?.getComponent(cc.ProgressBar)
            const parent = this.node
            this.hpProgressNode.width = parent.width
            this.hpProgressNode.x = -1 * parent.width / 2
            this.hpProgressNode.y = parent.height / 2 + 1 * this.hpProgressNode.height // y 轴位置 = 父节点高度 + 自身高度
            this.hpProgress.totalLength = this.node.width
        }
    },

    start () {

    },

    update (dt) {
        // 更新 hp 直到死亡销毁
        if (this.hpProgress) {
            this.hpProgress.progress = this.hp / this.maxHp
        }
        this.checkDead()
    },
});

export default unit
