import DataCenter from "./DataCenter";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PipeSpawn extends cc.Component {

    @property(cc.Node)
    Template: cc.Node = null;

    @property(cc.Node)
    StarParent: cc.Node = null;

    @property([cc.Node])
    StarList: cc.Node[] = [];

    PipeHeight = 793;
    PipeWidth = 138;

    private _birdLeftPos: cc.Vec2 = cc.v2();

    protected onLoad(): void {
        if (CC_DEBUG) {
            (window as any).PipeSpawn = this;
        }
    }

    startGame() {
        this.node.removeAllChildren();

        this.startToSpawn();
    }

    stopGame() {
        this.unscheduleAllCallbacks();
    }

    reset() {
        this.node.removeAllChildren();
        this.StarParent.removeAllChildren();
        this.unscheduleAllCallbacks();
    }

    setBirdPos(worldPos: cc.Vec2) {
        this._birdLeftPos = this.node.convertToNodeSpaceAR(worldPos);
    }

    protected startToSpawn() {

        this.makeOnePairPipe();

        this.scheduleOnce(() => {
            this.startToSpawn();
        }, DataCenter.getNextInterval())
    }

    protected makeOnePairPipe() {
        const width = DataCenter.realWidth;
        const height = DataCenter.realHeight;

        const startPosX = 1.5 * width;

        const rate = .5;
        const gap = DataCenter.getGap();
        const h = height - gap;
        const midY = Math.random() * h * rate + h * (1 - rate);
        console.log(`midY: ${midY}`);

        const bottomOne = cc.instantiate(this.Template);
        bottomOne.x = startPosX;
        const by = midY - gap / 2 - this.PipeHeight;;
        bottomOne.y = by;
        this.node.addChild(bottomOne);

        const topOne = cc.instantiate(this.Template);
        topOne.x = startPosX;
        const ty = midY + gap / 2 + this.PipeHeight;
        topOne.y = ty;
        topOne.scaleY = -1;
        this.node.addChild(topOne);

        this.makeStars(startPosX, midY);
    }

    makeStars(posX: number, posY: number) {
        const count = (Math.random() * 3 | 0) + 1;

        let x = posX + 50;

        for (let i = 0; i < count; i++) {
            x += Math.random() * 50 + 130;

            const rdx = Math.random() * this.StarList.length | 0;
            const temp = this.StarList[rdx];

            const node = cc.instantiate(temp);
            node.x = x;
            node.y = (Math.random() - .5) * 300 + posY;

            this.StarParent.addChild(node);
        }

    }

    protected update(dt: number): void {
        if (DataCenter.notToRun()) return;

        const children = this.node.children;
        const pw = this.PipeWidth;

        const birdPosX = this._birdLeftPos.x;

        for (let i = 0; i < children.length; i += 2) {
            const child = children[i];

            if ((child.x + this.PipeWidth) < birdPosX && !child['pipe_addedScore']) {
                this.node.dispatchEvent(new cc.Event.EventCustom('passed-pipe', true));
                child['pipe_addedScore'] = true;
                break;
            }
        }

        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];

            if (child.x < -pw) {
                child.removeFromParent();
            }
        }

        const starChildren = this.StarParent.children;
        for (let i = starChildren.length - 1; i >= 0; i--) {
            const child = starChildren[i];

            if (child.x < -50) {
                child.removeFromParent();
            }
        }

    }
}
