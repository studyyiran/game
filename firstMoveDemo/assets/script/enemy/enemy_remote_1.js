import normalUnitAcion from '../unit/normalUnitAcion'


cc.Class({
    extends: normalUnitAcion,
    ctor: function () {
        console.log('enemy 远程')
        this.actionArr = [this.checkAttack.bind(this), this.checkRange.bind(this), this.missThePlayer.bind(this), this.attackPosition.bind(this), this.waitAndPatrol.bind(this)]
    },

    properties: {
        targetArr: {
            get: function () {
                if (window?.global?.player?.getComponent('Player')) {
                    return [window.global.player.getComponent('Player'),  ...window?.global?.alliesRoot?.children?.map((node) => {
                        return node.getComponent('unit')
                    })]
                } else {
                    return []
                }
            },
        }
    },
});
