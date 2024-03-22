from random import random
from time import perf_counter, sleep
import traceback
from typing import Callable


class LazyMain:
    def __init__(
        self,
        main: Callable[..., bool],
        errorHandler: Callable[[Exception], None] = None,  # type: ignore
        sleepMin=3,
        sleepMax=5,
        loopCount=-1,
    ):
        self.main = main
        self.errorHandler = errorHandler
        self.sleepMin = sleepMin
        self.sleepMax = sleepMax
        self.loopCount = loopCount

    def __getSleepTime(self):
        return random() * self.sleepMin + self.sleepMax - self.sleepMin

    def run(self, *args, **kwargs):
        while True:
            ok = False
            t1 = perf_counter()

            try:
                ok = self.main(*args, **kwargs)
            except Exception as e:
                print("An error ocurred.", e)
                traceback.print_exc()

                if self.errorHandler != None:
                    self.errorHandler(e)

            sleepTime = self.__getSleepTime()

            if self.loopCount > 0:
                self.loopCount -= 1

            if ok:
                t2 = perf_counter()

                print(f"Done in {t2 - t1:.2f}s.")

                if self.loopCount > 0:
                    print(f"Sleeping for {sleepTime:.2f}s...")

            if self.loopCount == 0:
                break

            sleep(sleepTime)
