import React, { useState, useEffect } from 'react';

function useTimer() {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setSeconds((seconds) => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0 && !isPaused) {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isActive, isPaused, seconds]);

    const start = () => {
        setIsActive(true);
    };

    const pause = () => {
        setIsPaused(true);
    };

    const reset = () => {
        setSeconds(0);
        setIsActive(false);
        setIsPaused(false);
    };

    const resume = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const timeString = new Date(seconds * 1000).toISOString().substr(11, 8);

    return { timeString, start, pause, resume, reset };
}

export default useTimer;
