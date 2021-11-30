/*
处理了碰撞之后的扣血并销毁的逻辑。
damage 来自于初始化
 */

// 暂时未可调

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        const targetScript = otherCollider.getComponent('unit')
        if (targetScript) {
            targetScript.hp -= this.node.damage || 1 // fire 的时候需要赋值
        }
        // 销毁子弹 并扣血
        this.dead()
    },

    dead() {
        this.node.destroy()
    },

    start () {

    },

    // update (dt) {},
});
