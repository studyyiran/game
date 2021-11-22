// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    ctor: function () {
        if (!this.onDeadArr) {
            this.init([])
        }
        this.deadCondition = () => this.hp <= 0
    },

    properties: {
        speed: 50, // 移动速度
        maxHp: 10, // 最大生命值
        viewRange: 100, // 视野范围
        meleeAttackDamage: 0,
        meleeAttackRange: 0,
        patrolWaitMaxTime: 1, // 目标范围内没有敌人时，每次巡逻的时间
        remoteAttackDamage: 0,
        remoteAttackRange: 0,
        attackInterval: 1, // 攻击间隔
        attackRange: 10,
        hpRecover: 10,
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
        //
        this.hp = this.maxHp
        this.status = true
    },

    start () {

    },

    update (dt) {
        this.checkDead()
    },
});
