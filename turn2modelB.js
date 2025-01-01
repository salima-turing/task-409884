const batchLogger = (batchSize = 10, flushInterval = 5000) => {
    let logBatch = [];
    let flushTimer;

    // Function to add a new log to the batch
    const logError = (error) => {
        logBatch.push({
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        if (logBatch.length >= batchSize) {
            flushBatch();
        } else if (!flushTimer) {
            flushTimer = setTimeout(flushBatch, flushInterval);
        }
    };

    // Function to flush the current batch to the logging server
    const flushBatch = () => {
        if (flushTimer) {
            clearTimeout(flushTimer);
            flushTimer = null;
        }

        if (logBatch.length > 0) {
            sendLogsToServer(logBatch)
                .then(() => {
                    logBatch = [];
                })
                .catch(err => {
                    console.error('Error sending batch logs:', err);
                    // Optionally, you can retry sending the batch if it fails
                });
        }
    };

    // Simulate sending logs to a server
    const sendLogsToServer = (logs) => {
        // In a real scenario, you would replace this with an HTTP request to a logging server
        console.log('Sending log batch:');
        console.log(logs);

        // Simulate the request taking time
        return new Promise(resolve => setTimeout(resolve, 200));
    };

    return {
        logError
    };
};

// Initialize the batch logger
const myBatchLogger = batchLogger();

// Now you can use this logger throughout your application
try {
    throw new Error('Some example error');
} catch (error) {
    myBatchLogger.logError(error);
}

// Logs multiple errors to demonstrate batching
for (let i = 0; i < 5; i++) {
    try {
        throw new Error(`Another example error ${i}`);
    } catch (error) {
        myBatchLogger.logError(error);
    }
}
