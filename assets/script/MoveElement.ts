import DataCenter from "./DataCenter";

const { ccclass } = cc._decorator;

@ccclass
export default class MoveElement extends cc.Component {

    protected update(dt: number): void {
        if (DataCenter.notToRun()) return;

        this.node.x -= DataCenter.speed;
    }
}
