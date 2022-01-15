// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    // 角色
    Player: {
      default: null,
      type: cc.Node
    },
    // 单位
    tower: {
      default: null,
      type: cc.Prefab
    },
    enemyTower: {
      default: null,
      type: cc.Prefab
    },
    // 地图 我为啥不直接去读取。
    // enemyTarget: {
    //   default: null,
    //   type: cc.Prefab
    // },
    // UI
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
    // 一些小部件
    hpBar: {
      default: null,
      type: cc.Prefab
    },
    progressBar: {
      default: null,
      type: cc.Prefab
    },
    // 配置
    needScore: 100,
    debuggerOpen: false,
    // 废弃
    Spawn: {
      default: null,
      type: cc.Node
    },
    Ai: {
      default: null,
      type: cc.Node // 如果我要动态实例化 n 个 ai 要如何告知给 TimerBomb
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
    // 动态找到目标
    window.global = {
      player: this.Player,
      ai: this.Ai,
      enemyRoot: cc.find('root/enemyRoot', this.node),
      alliesRoot: cc.find('root/alliesRoot', this.node),
      neutralRoot: cc.find('root/neutralRoot', this.node),
      bulletRoot: cc.find('root/bulletRoot', this.node),
      tower: this.tower,
      enemyTower: this.enemyTower,
      canvas: this.node,
      game: this,
      uiPrefab: {
        hpBar: this.hpBar,
        progressBar: this.progressBar
      },
      // 玩家出生地
      playerBirth: cc.find('root/alliesRoot/playerBirth', this.node),
      enemyBirth: cc.find('root/enemyRoot/enemyBirth', this.node),
      // 敌人的目标
      enemyTarget: this.playerBirth
    }
    console.log(this.getComponent(cc.AudioSource))
    this.getComponent(cc.AudioSource).play()
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
    if (!window.global?.enemyBirth?.isValid || window.global.enemyBirth.getComponent('unit').hp <= 0) {
      this.gameOverLabel.string = 'You Win'
      // cc.audioEngine.playEffect(this.scoreAudioPlayer, true);
      this.stopGame()
    }

    if (!window.global?.playerBirth?.isValid || window.global.playerBirth.getComponent('unit').hp <= 0) {
      this.gameOverLabel.string = 'Game Over'
      // cc.audioEngine.playEffect(this.scoreAudioAi, true);
      this.stopGame()
    }
    // 玩家血量空
    // if (this.Player.getComponent('unit').hp <= 0) {
    //   this.gameOverLabel.string = 'You Dead'
    //   this.stopGame()
    // }

  },

  stopGame() {
    this.gameOverLabel.node.active = true
    this.startButton.active = true
    // this.Ai.getComponent('Ai').dead()
    // this.Player.getComponent('Player').onDead()
    // this.Spawn.getComponent('Spawn').dead()
    // this.enabled = false
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
    this.renderScore()
    this.checkGameOver()
  }
})
