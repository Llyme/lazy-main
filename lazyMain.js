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
     * @param {object} config
     * 
     * @param {function(...args): Promise<boolean>} config.main
     * The `main` function.
     * 
     * @param {function(Error): void} [config.errorHandler]
     * Called when the `main` function
     * raised an error.
     * 
     * @param {number} [config.sleepMin]
     * The minimum sleep time between
     * each run.
     * 
     * Default `3000`.
     * 
     * @param {number} [config.sleepMax]
     * The maximum sleep time between
     * each run.
     * 
     * Default `5000`.
     * 
     * @param {number} [config.loopCount]
     * How many times should the `main` function
     * be called?
     * 
     * if `-1` or less,
     * it will run forever.
     * 
     * Default `-1`
     * 
     * @param {boolean} [config.runOnce]
     * If `true`, the `main` function
     * will only run once,
     * otherwise it will run forever.
     * 
     * @param {boolean} [config.runForever]
     * If `true`, the `main` function
     * will run forever,
     * otherwise it will only run once.
     */
    constructor(config) {
        const {
            main,
            errorHandler,
            sleepMin,
            sleepMax,
            loopCount,
            runOnce,
            runForever
        } = config;

        this.main = main;
        this.errorHandler = errorHandler;
        this.sleepMinMS = sleepMin ?? this.sleepMinMS;
        this.sleepMaxMS = sleepMax ?? this.sleepMaxMS;

        if (loopCount !== undefined)
            this.loopCount = loopCount ?? this.loopCount;

        else if (runOnce !== undefined)
            this.loopCount = runOnce ? 1 : -1;

        else if (runForever !== undefined)
            this.loopCount = runForever ? -1 : 1;
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