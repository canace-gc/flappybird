
const { ccclass, property } = cc._decorator;

@ccclass
export default class GroundLogic extends cc.Component {

    @property(cc.Node)
    Template: cc.Node = null;

    @property
    width = 0;

    private _count = 0;
    @property
    get count() {
        return this._count;
    }
    set count(val) {
        this._count = val;
        this.setup();
    }
    
    protected onLoad(): void {
        this.width = 37;

        const dw = cc.view.getVisibleSize().width;
        this.count = Math.ceil(dw / this.width) + 1;
        console.log(`this.count: ${this.count}`);
        this.setup();
    }

    setup() {
        this.node.removeAllChildren();
        const w = this.width;

        for (let i = 0; i < this.count; i++) {
            const node = cc.instantiate(this.Template);
            this.node.addChild(node);
            node.name = `name: ${i + 1}`;
            // console.log(node.name);
            node.setPosition(cc.v2(i * w, 0));
        }
    }

    checkOutOfScreen() {
        const children = this.node.children;
        const w = this.width;

        const first = children[0];

        if (first.x < -w) {
            // 第一个离开了屏幕
            children.shift();
            var lastX = children[children.length - 1].getPosition().x;
            children.push(first);
            first.setPosition(cc.v2(lastX + w, 0));
            // console.log(`name: ${first.name} - lastX: ${lastX}`);
        }
    }

    protected update(dt: number): void {
        this.checkOutOfScreen();
    }
}
