// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const unit = cc.Class({
    extends: cc.Component,

    ctor: function () {
        if (!this.onDeadArr) {
            this.init([])
        }
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
        needHp: false,
    },

    init: function (arr) {
        this.onDeadArr = arr
    },

    setDeadCondition(fn) {
        this.deadCondition = fn
    },

    // LIFE-CYCLE CALLBACKS:
    addOnDead(fn) {
        if (this.onDeadArr) {
            this.onDeadArr.push(fn)
        } else {
            this.init([fn])
        }
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
        this.hp = this.maxHp
        this.status = true
        // 如果有 hp 节点，就进行位置校正
        this.hpProgressNode = this.node.getChildByName('hpBar')
        if (this.hpProgressNode) {
            this.hpProgress = this.hpProgressNode?.getComponent(cc.ProgressBar)
            const parent = this.node
            this.hpProgressNode.width = parent.width
            this.hpProgressNode.x = -1 * parent.width / 2
            this.hpProgressNode.y = 50 + parent.height / 2 + this.node.height / 2 // y 轴位置 = 父节点高度 + 自身高度
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
