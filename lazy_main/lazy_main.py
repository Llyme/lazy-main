from random import random
from time import perf_counter, sleep
import traceback
import signal
from typing import Callable, Union


class LazyMain:
    def __init__(
        self,
        main: Callable[..., Union[bool, signal.Signals]],
        error_handler: Callable[[Exception], None] = None,  # type: ignore
        print_logs: bool = True,
        sleep_min: int = 3,
        sleep_max: int = 5,
        loop_count: int = -1,
        run_once: bool = None,  # type: ignore
        run_forever: bool = None,  # type: ignore
    ):
        """
        main: The function that will be called every loop.
        error_handler: If the `main` function throws an error, this will be called.
        print_logs: If it should print logs.
        sleep_min: Minimum sleep time, in seconds.
        sleep_max: Maximum sleep time, in seconds.
        loop_count: How many times this will loop. If `-1` or less, it will infinitely loop.
        run_once: If `true`, the `main` function will only run once, otherwise it will run forever.
        run_forever: If `true`, the `main` function will run forever, otherwise it will only run once.
        """
        self.main = main
        self.error_handler = error_handler
        self.print_logs = print_logs
        self.sleep_min = sleep_min
        self.sleep_max = sleep_max
        self.loop_count = loop_count

        if run_once != None:
            self.loop_count = 1 if run_once else -1

        elif run_forever != None:
            self.loop_count = -1 if run_forever else 1

    def __get_sleep_time(self):
        return random() * self.sleep_min + self.sleep_max - self.sleep_min

    def run(self, *args, **kwargs):
        """
        Starts the loop.
        """
        while True:
            ok = False
            t1 = perf_counter()

            try:
                ok = self.main(*args, **kwargs)
            except Exception as e:
                if self.print_logs:
                    print("An error ocurred.", e)

                    traceback.print_exc()

                if self.error_handler != None:
                    self.error_handler(e)

            if ok == signal.SIGTERM:
                break

            sleep_time = self.__get_sleep_time()

            if self.loop_count > 0:
                self.loop_count -= 1

            if ok:
                t2 = perf_counter()

                if self.print_logs:
                    print(f"Done in {t2 - t1:.2f}s.")

                if self.loop_count > 0 and self.print_logs:
                    print(f"Sleeping for {sleep_time:.2f}s...")

            if self.loop_count == 0:
                break

            sleep(sleep_time)
