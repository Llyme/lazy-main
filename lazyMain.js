import { sleep } from './sleep.js';

export class LazyMain {
    sleepMinMS = 3000;
    sleepMaxMS = 5000;
    /**
     * If -1 or lower,
     * it will infinitely loop.
     */
    loopCount = -1;

    /**
     * 
     * @param {object} kwargs
     * @param {function(...args): Promise<boolean>} kwargs.main
     * @param {function(Error): void|undefined} kwargs.errorHandler
     * @param {number|undefined} kwargs.sleepMin
     * @param {number|undefined} kwargs.sleepMax
     * @param {number|undefined} kwargs.loopCount
     */
    constructor(kwargs) {
        const {
            main,
            errorHandler,
            sleepMin,
            sleepMax,
            loopCount
        } = kwargs;

        this.main = main;
        this.errorHandler = errorHandler;
        this.sleepMinMS = sleepMin ?? this.sleepMinMS;
        this.sleepMaxMS = sleepMax ?? this.sleepMaxMS;
        this.loopCount = loopCount ?? this.loopCount;
    }

    get #sleepTime() {
        return Math.random() * this.sleepMinMS +
            this.sleepMaxMS - this.sleepMinMS;
    }

    async run(...args) {
        while (true) {
            let ok = false;

            const t1 = performance.now();

            try {
                ok = await this.main(...args);
            } catch (e) {
                console.log('An error ocurred.', e);

                if (this.errorHandler != null)
                    this.errorHandler(e);
            }

            const sleepTime = this.#sleepTime;

            if (this.loopCount > 0)
                this.loopCount--;

            if (ok) {
                const t2 = performance.now();

                console.log(`Done in ${((t2 - t1) / 1000).toFixed(2)}s.`);

                if (this.loopCount > 0)
                    console.log(`Sleeping for ${(sleepTime / 1000).toFixed(2)}s...`);
            }

            if (this.loopCount == 0)
                break;

            await sleep(sleepTime);
        }
    }
}