
import normalUnitAcion from '../unit/normalUnitAcion'


cc.Class({
    extends: normalUnitAcion,
    ctor: function () {
        console.log('remote allies A~~~')
        // this.actionArr = [this.checkDead.bind(this), this.checkAttack.bind(this), this.checkRange.bind(this)]
        this.actionArr = [this.checkAttack.bind(this), this.checkRange.bind(this), this.checkFollowPlayer.bind(this)]
    },

    properties: {
        targetArr: {
            get: function () {
                return window?.global?.enemyRoot?.children?.map((node) => {
                    return node.getComponent('unit')
                }) || []
            },

        }
    }
});
