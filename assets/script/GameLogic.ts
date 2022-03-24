import Bird from "./Bird";
import DataCenter from "./DataCenter";
import GameOver from "./GameOver";
import PipeSpawn from "./PipeSpawn";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLogic extends cc.Component {

    @property(Bird)
    bird: Bird = null;

    @property(PipeSpawn)
    pipeSpawn: PipeSpawn = null;

    @property(GameOver)
    gameover: GameOver = null;

    @property(cc.Label)
    scoreLbl: cc.Label = null;

    @property(cc.Label)
    tipLbl: cc.Label = null;


    protected onLoad(): void {
        cc.director.getCollisionManager().enabled = true;
        DataCenter.initDataCenter();

        if (CC_DEBUG) {
            (window as any).GameLogic = this;
        }

        const birdPos = this.bird.node.convertToWorldSpaceAR(cc.v2(-this.bird.node.width / 2, 0));
        this.pipeSpawn.setBirdPos(birdPos);

        console.log(window.navigator.userAgent);
    }

    protected onEnable(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on('game-over', this.onGameOver, this);
        this.node.on('restart', this.onRestart, this);
        this.node.on('passed-pipe', this.onPassedPipe, this);
        this.node.on('star-score', this.onStarScore, this);
    }

    protected onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off('game-over', this.onGameOver, this);
        this.node.off('restart', this.onRestart, this);
        this.node.off('passed-pipe', this.onPassedPipe, this);
        this.node.off('star-score', this.onStarScore, this);
    }

    protected onTouchStart() {
        // if (this.gameover.node.active) {
        //     this.gameover.closeWnd();
        // } else {
        //     this.gameover.showWnd();
        // }
        // return;

        if (DataCenter.waiting) {
            DataCenter.waiting = false;
            this.tipLbl.node.active = false; 

            this.pipeSpawn.startGame();
        }

        this.bird.onTap(DataCenter.velocity);
    }

    updateScore() {
        this.scoreLbl.string = DataCenter.score + '';
    }

    protected onGameOver(): void {
        console.log('onGameOver');
        DataCenter.gameover = true;
        DataCenter.updateBest();

        this.pipeSpawn.stopGame();
        this.gameover.initUI();
        this.gameover.showWnd();
    }

    protected onRestart() {
        DataCenter.waiting = true;
        DataCenter.gameover = false;
        DataCenter.score = 0;
        this.updateScore();

        this.bird.reset();
        this.pipeSpawn.reset();
    }

    protected onPassedPipe() {
        console.log('onPassedPipe');

        DataCenter.score += 20;
        this.updateScore();
    }

    protected onStarScore(evt: cc.Event.EventCustom) {
        const score = +evt.getUserData() || 0;
        DataCenter.score += score;
        this.updateScore();
    }
}
