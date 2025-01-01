class BatchLogger {
    constructor({ batchSize = 5, flushInterval = 3000 } = {}) {
        this.batchSize = batchSize;
        this.flushInterval = flushInterval;
        this.logQueue = [];
        this.isFlushing = false;

        // Start the interval to flush logs
        setInterval(() => this.flushLogs(), this.flushInterval);
    }

    logError(error) {
        const logEntry = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        };

        this.logQueue.push(logEntry);
        console.warn("Error logged:", logEntry);

        // Check if we need to flush the logs immediately
        if (this.logQueue.length >= this.batchSize) {
            this.flushLogs();
        }
    }

    async flushLogs() {
        if (this.isFlushing || this.logQueue.length === 0) return;

        this.isFlushing = true; // Avoid concurrent flushes

        try {
            // Sending logs (this is an example; you'll need to implement actual transmission logic to your logging server)
            await this.sendLogsToServer(this.logQueue);

            // Clear the log queue after sending
            this.logQueue = [];
        } catch (error) {
            console.error("Failed to send logs:", error);
        } finally {
            this.isFlushing = false; // Allow further log flushes
        }
    }

    async sendLogsToServer(logs) {
        // Replace with actual server endpoint and implementation
        console.log("Sending logs to server:", logs);
        return new Promise((resolve) => {
            // Simulate async delay
            setTimeout(() => resolve(), 1000);
        });
    }
}

// Instantiate the logger
const batchLogger = new BatchLogger({ batchSize: 3, flushInterval: 5000 });

// Example usage
function exampleFunction() {
    try {
        // Simulate potential error
        throw new Error("An example error occurred");
    } catch (error) {
        batchLogger.logError(error);
    }
}

// Simulate some operations that may produce errors
setInterval(exampleFunction, 1000); // Simulate an error every second
