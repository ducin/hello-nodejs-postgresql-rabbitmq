const express = require('express');
const amqplib = require('amqplib');
const prometheus = require('prom-client');
const path = require('path');
const { setupTracing } = require('./tracing');
const { CalculationService } = require('./calculation');

const tracer = setupTracing();
const calculationService = new CalculationService();

const app = express();
const PORT = 3000;
let channel;

app.use(express.static(path.join(__dirname)));

const user = `myuser`
const pswd = `mypassword`

// Initialize Prometheus metrics
const messageCounter = new prometheus.Counter({
    name: 'app_rabbitmq_messages_sent_total',
    help: 'Total number of messages sent to RabbitMQ'
});

// Enable default metrics (memory, CPU, etc.)
prometheus.collectDefaultMetrics();

// Add metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    res.send(await prometheus.register.metrics());
});

async function connect() {
    const connection = await amqplib.connect(`amqp://${user}:${pswd}@rabbitmq`);
    channel = await connection.createChannel();
    await channel.assertQueue('task_queue', { durable: true });
}

app.post('/send', async (req, res) => {
    tracer.startActiveSpan('send_message', async (span) => {
        try {
            const calculation = calculationService.performCalculation(tracer, span.spanContext());
            const msg = JSON.stringify({
                text: 'Hello from Producer',
                calculationResult: calculation
            });
            
            channel.sendToQueue('task_queue', Buffer.from(msg), {
                persistent: true,
                headers: {
                    correlationId: span.spanContext().traceId
                }
            });
            
            // Increment message counter
            messageCounter.inc();
            
            res.send({ message: 'Message sent', calculation, correlationId: span.spanContext().traceId });
        } catch (error) {
            span.recordException(error);
            res.status(500).send({ error: 'Failed to process message' });
        }
    });
});

app.listen(PORT, () => {
    connect();
    console.log(`Producer running on port ${PORT}`);
});
