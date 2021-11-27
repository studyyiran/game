
cc.Class({
    extends: cc.Component,

    properties: {
        destroyWhenFinish: true,
    },

    checkFinish () {
        // 结束后清除
        if (this.progressScript.progress >= 1) {
            this.progressScript.progress = 0
            if (this.destroyWhenFinish) {
                this.node.active = false
            }
        }
    },

    onLoad () {
        this.progressScript = this.getComponent(cc.ProgressBar)
        const parent = this.node.parent
        // 校正位置
        if (this.progressScript) {
            this.node.width = parent.width
            this.node.x = -1 * parent.width / 2
            this.node.y = parent.height / 2 + this.node.height / 2 // y 轴位置 = 父节点高度 + 自身高度
            this.progressScript.totalLength = this.node.width
        }
    },

    update (dt) {
        this.checkFinish()
    },
});
