import DataCenter from "./DataCenter";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bird extends cc.Component {

    private _startPos: cc.Vec2 = null;

    private velocity = 0;

    private get gravity() {
        return DataCenter.gravity;
    }

    public reset() {
        this.node.setPosition(this._startPos);
        this.getComponent(cc.Animation).play('fly');
        this.node.angle = 0;
    }

    protected onLoad(): void {
        this._startPos = cc.v2(this.node.getPosition());
    }

    protected update(dt: number): void {
        if (DataCenter.notToRun()) return;

        this.velocity += this.gravity;
        this.node.y -= this.velocity;

        if (this.velocity < 0) {
            // 这里最好不要直接设置为35度
            this.node.angle = 35;
        } else {
            this.node.angle = -Math.min(this.velocity, 10) / 10 * 90;
        }
    }

    onTap(velocity: number) {
        this.velocity = velocity;
    }

    die() {
        this.velocity = 0;
        this.node.angle = -90;
        this.getComponent(cc.Animation).stop('fly');

        console.log(this.node.getPosition());
    }

    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        console.log(other.node.name);
        if (DataCenter.gameover) {
            return;
        }

        const name = other.node.name;

        if (name.startsWith('Star')) {
            let score = 0;
            if (name.endsWith('Gold')) {
                score = 15;
            } else if (name.endsWith('Silver')) {
                score = 10;
            } else {
                score = 5;
            }


            const evt = new cc.Event.EventCustom('star-score', true);
            evt.setUserData(score);
            this.node.dispatchEvent(evt);

            cc.tween(other.node).by(0.2, { y: 50, opacity: 0 }).removeSelf().start();

            return;
        }

        if (name === 'Pipe') {
            const targetY = -327;
            const duration = (this.node.y - targetY) / 900;
            cc.tween(this.node).to(duration, { y: -327 }).start();
        }

        this.die();

        const event = new cc.Event.EventCustom('game-over', true);
        this.node.dispatchEvent(event);
    }
}
