
const BEST_SCORE = 'flappy-bird.best-score';

export default class DataCenter {

    // 速度
    public static get speed() {
        if (!this.isIOS()) {
            return 1;
        }

        if (this.score > 550) {
            return 5;
        }

        if (this.score > 300) {
            return 4.5;
        }

        if (this.score > 100) {
            return 3.9;
        }
        return 3.7;
    }

    public static gravity = .1;
    public static velocity = -5;

    public static gameover = false;
    public static waiting = true;

    public static realWidth = 0;
    public static realHeight = 0;

    public static score = 0;
    public static best = 0;

    private static _nextInterval = 5;

    private static isIOS() {
        const userAgent = window.navigator.userAgent;
        return /iphone/i.test(userAgent);

    }

    public static initDataCenter() {
        if (this.isIOS()) {
            this.gravity = 0.32;
            this.velocity = -8;
            this._nextInterval = 8 / (this.speed / 1.3);
        }

        this.realWidth = cc.view.getVisibleSize().width;
        this.realHeight = cc.view.getVisibleSize().height;
        this.best = +localStorage.getItem(BEST_SCORE) || 0;

        console.log(`Gravity: ${this.gravity}, Velocity: ${this.velocity}`);
    }

    public static updateBest() {
        this.best = Math.max(this.best, this.score);

        localStorage.setItem(BEST_SCORE, this.best + '');
    }

    public static notToRun() {
        return this.waiting || this.gameover;
    }

    public static getGap() {
        if (this.score > 300) {
            return this.makeRandomGap(250, 300);
        }

        if (this.score > 200) {
            return this.makeRandomGap(300, 400);
        }

        return this.makeRandomGap(350, 450);
    }

    public static getNextInterval() {
        return this._nextInterval;
    }

    private static makeRandomGap(min: number, max: number) {
        return (Math.random() * (max - min) | 0) + min;
    }

}
