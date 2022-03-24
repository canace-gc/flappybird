import DataCenter from "./DataCenter";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOver extends cc.Component {

    @property(cc.Label)
    scoreLbl: cc.Label = null;

    @property(cc.Label)
    bestLbl: cc.Label = null;

    protected onRestartBtnClicked() {
        this.closeWnd();
        this.node.dispatchEvent(new cc.Event.EventCustom('restart', true));
    }

    protected onShareBtnClicked() {
        this.closeWnd();
        this.node.dispatchEvent(new cc.Event.EventCustom('restart', true));
    }

    protected onAddToLeaderBoard() {
        this.closeWnd();
        this.node.dispatchEvent(new cc.Event.EventCustom('restart', true));
    }

    initUI() {
        this.scoreLbl.string = DataCenter.score + '';
        this.bestLbl.string = DataCenter.best + '';
    }

    _cb: () => void = null;
    showWnd(cb: () => void = null) {
        this._cb = cb;
        this.node.active = true;
        this.getComponent(cc.Animation).play('wnd-pop');
    }

    closeWnd() {
        console.log('closeWnd');
        this.getComponent(cc.Animation).play('wnd-close');
    }

    frameEvent_WndClosed() {
        this.node.active = false;
    }

    frameEvent_GameEntered() {
        this._cb && this._cb();
        this._cb = null;
    }
}
