// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 500, // 移动速度
        maxHp: 100, // 最大生命值
        viewRange: 100, // 视野范围
        patrolWaitMaxTime: 1, // 目标范围内没有敌人时，每次巡逻的时间
        meleeAttackRange: 0,
        meleeAttackDamage: 0,
        remoteAttackRange: 0,
        remoteAttackDamage: 0,
        attackInterval: 1, // 攻击间隔


        attackRange: 10,
        damage: 1, // 攻击力
    },

    // LIFE-CYCLE CALLBACKS:

    checkDead() {
        if (this.hp < 0) {
            this.node.destroy()
        }
    },

    onLoad () {
        //
        this.hp = this.maxHp
    },

    start () {

    },

    update (dt) {
        this.checkDead()
    },
});
