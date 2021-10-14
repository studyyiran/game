// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bombTime: 1000,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    getDistance () {
        // 获取 player
        const player = this.node.parent.getComponent('Game').Player
        // 计算距离
        const distance = this.node.position.sub(player.getPosition()).mag();
        const minDis = (player.width + this.node.width) / 2
        if (distance < minDis) {
            this.whenDestory()
        }

    },

    whenDestory() {
      this.node.destroy();
      this.onDestoryCallSpawn()
    },

    start () {

    },

    update (dt) {
        // 计算距离
        this.getDistance()
        // 计算爆炸倒计时
    },
});
