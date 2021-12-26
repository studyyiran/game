
// 应该承担更多，目前只负责，结束后自动消失。这块如果要改，可以和 spawn 的精简一块做。

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
            this.node.y = parent.height / 2 + this.node.height / 2 + this.node.height / 2 // y 轴位置 = 父节点高度一半 + 自身高度一半（一半的原因是因为锚点）+ 自身高度（进度条组件需要在顶部）
            this.progressScript.totalLength = this.node.width
        }
    },

    update (dt) {
        this.checkFinish()
    },
});
