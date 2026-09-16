const { performance } = require('perf_hooks');

const measureExecutionTime = async (fn) => {
    const start = performance.now();

    const result = await fn();

    const durationMs = Number(
        (performance.now() - start).toFixed(2)
    );

    return { result, durationMs };
};

module.exports = {
    measureExecutionTime
};