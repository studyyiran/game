// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    Player: {
      default: null,
      type: cc.Node
    },
    Spawn: {
      default: null,
      type: cc.Node
    },
    Ai: {
      default: null,
      type: cc.Node // 如果我要动态实例化 n 个 ai 要如何告知给 TimerBomb
    },
    playerScoreLabel: {
      default: null,
      type: cc.Label,
    },
    aiScoreLabel: {
      default: null,
      type: cc.Label,
    },
    gameOverLabel: {
      default: null,
      type: cc.Label
    },
    startButton: {
      default: null,
      type: cc.Node // TODO 设置为 Node 和 Label 有啥区别？ 设置为 Label 生一次 getComponent
    },
    scoreAudioAi: {
      default: null,
      type: cc.AudioClip// 得分音效资源
    },
    scoreAudioPlayer: {
      default: null,
      type: cc.AudioClip
    },
    needScore: 100,
    debuggerOpen: false,
    tower: {
      default: null,
      type: cc.Prefab
    },
  },

  // newTimerBomb () {

  // },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},
  gainScore(ccNode) {
    if (ccNode === this.Player) {
      this.score.player++
      // 播放得分音效
      cc.audioEngine.playEffect(this.scoreAudioPlayer, false);
    }
    if (ccNode === this.Ai) {
      this.score.ai++
      cc.audioEngine.playEffect(this.scoreAudioAi, false);
    }
  },

  onLoad() {
    cc.director.getPhysicsManager().enabled = true;
    if (this.debuggerOpen) {
      cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
          cc.PhysicsManager.DrawBits.e_pairBit |
          cc.PhysicsManager.DrawBits.e_centerOfMassBit |
          cc.PhysicsManager.DrawBits.e_jointBit |
          cc.PhysicsManager.DrawBits.e_shapeBit
      ;
    }
    cc.director.getPhysicsManager().gravity = cc.v2();
    window.global = {
      player: this.Player,
      ai: this.Ai,
      enemyRoot: cc.find('root/enemyRoot', this.node),
      alliesRoot: cc.find('root/alliesRoot', this.node),
      neutralRoot: cc.find('root/neutralRoot', this.node),
      enemyBullet: cc.find('root/enemyBullet', this.node),
      tower: this.tower,
      canvas: this.node,
      game: this
    }
  },

  onEnable() {
    // console.log(4)
  },

  start () {
    // console.log(7)
    // 初始化分数
    this.score = {player: 0,ai:0}
    this.stopGame()
  },

  renderScore() {
    // TODO 先写的随意一些。
    this.node.getChildByName('ui').getChildByName('playerHp').getComponent(cc.Label).string = parseInt(this.Player.getComponent('unit').hp)
    // this.playerScoreLabel.string = this.node.getChildByName('enemyRoot').getChildByName('JinZhan').getComponent('JinZhan').status
    this.playerScoreLabel.string = this.score.player
    this.aiScoreLabel.string = this.score.ai
  },

  checkGameOver() {
    if (this.score.player > this.needScore) {
      this.gameOverLabel.string = 'You Win'
      cc.audioEngine.playEffect(this.scoreAudioPlayer, true);
      this.stopGame()
    }
    if (this.score.ai > this.needScore) {
      this.gameOverLabel.string = 'Game Over'
      cc.audioEngine.playEffect(this.scoreAudioAi, true);
      this.stopGame()
    }
    // 玩家血量空
    if (this.Player.getComponent('unit').hp <= 0) {
      this.gameOverLabel.string = 'You Dead'
      this.stopGame()
    }

  },

  stopGame() {
    this.gameOverLabel.node.active = true
    this.startButton.active = true
    this.Ai.getComponent('Ai').dead()
    this.Player.getComponent('Player').onDead()
    // this.Spawn.getComponent('Spawn').dead()
    this.enabled = false
  },

  restartGame() {
    // 初始化分数
    this.score = {player: 0,ai:0}
    // 隐藏对象
    this.gameOverLabel.node.active = false
    this.startButton.active = false
    // 启动
    // this.Spawn.getComponent('Spawn').init()
    this.Player.getComponent('Player').init()
    // this.Ai.getComponent('Ai').init()
    this.enabled = true
  },

  update () {
    // console.log('u1')
    this.renderScore()
    this.checkGameOver()
  }
})
