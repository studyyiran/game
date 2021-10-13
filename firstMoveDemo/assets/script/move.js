// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 10,
        toward: {
            default: {},
        },
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    onKeyDownHandler(e) {
        const currentKey = e.keyCode
        console.log(currentKey)
        switch (currentKey) {
            case cc.macro.KEY.a:
                if (!this.toward.a) {
                    this.towardX = -1
                }
                this.toward.a = true
                break;
            case cc.macro.KEY.d:
                if (!this.toward.d) {
                    debugger
                    this.towardX = 1
                }
                this.toward.d = true
                break;
            case cc.macro.KEY.w:
                if (!this.toward.w) {
                    this.towardY = 1
                }
                this.toward.w = true
                break;
            case cc.macro.KEY.s:
                if (!this.toward.s) {
                    this.towardY = -1
                }
                this.toward.s = true
                break;

        }
    },

    onKeyUpHandler(e) {
        const currentKey = e.keyCode
        switch (currentKey) {
            case cc.macro.KEY.a:
                this.toward.a = false
                if (!this.toward.a && !this.toward.d) {
                    this.towardX = 0
                } else if (this.toward.a) {
                    this.towardX = -1
                }
                else if (this.toward.d) {
                    this.towardX = 1
                }
                break;
            case cc.macro.KEY.d:
                this.toward.d = false
                if (!this.toward.a && !this.toward.d) {
                    this.towardX = 0
                } else if (this.toward.a) {
                    this.towardX = -1
                }
                else if (this.toward.d) {
                    this.towardX = 1
                }

                break;
            case cc.macro.KEY.w:
                this.toward.w = false
                if (!this.toward.w && !this.toward.s) {
                    this.towardY = 0
                } else if (this.toward.w) {
                    this.towardY = 1
                } else if (this.toward.s) {
                    this.towardY = -1
                }

                break;
            case cc.macro.KEY.s:
                this.toward.s = false
                if (!this.toward.w && !this.toward.s) {
                    this.towardY = 0
                } else if (this.toward.w) {
                    this.towardY = 1
                } else if (this.toward.s) {
                    this.towardY = -1
                }

                break;

        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDownHandler, this);
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_PRESS, this.onKeyDownHandler, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUpHandler, this);
    },

    start() {

    },

    onDestroy() {
        console.log('onDestroy')
    },

    moveByToward(dt) {
        let realDt = dt
        // console.log(this.toward)
        if (this.towardX && this.towardY) {
            // console.log('shuang!!!!')
            realDt = realDt / 1.414
        }
        if (this.towardX) {
            this.node.x += this.towardX * this.speed * realDt
        }
        if (this.towardY) {
            this.node.y += this.towardY * this.speed * realDt
        }
        // if (this.towardXLast === 'a') {
        //     this.node.x -= this.speed * realDt
        // } else if (this.towardXLast === 'd') {
        //     this.node.x += this.speed * realDt
        // }

        // if (this.towardYLast === 'w') {
        //     this.node.y += this.speed * realDt
        // } else if (this.towardYLast === 's') {
        //     this.node.y -= this.speed * realDt
        // }

    },

    update(dt) {
        this.moveByToward(dt)
    },
});
