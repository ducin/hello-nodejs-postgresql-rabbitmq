const express = require('express');
const amqplib = require('amqplib');
const prometheus = require('prom-client');
const path = require('path');
const { Pool } = require('pg');
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

// PostgreSQL connection
const pool = new Pool({
    user: 'myuser',
    password: 'mypassword',
    host: 'postgres',
    database: 'mydatabase',
    port: 5432
});

// Add new endpoint for blog posts
app.get('/blog', async (req, res) => {
    tracer.startSpan('fetch_blog_posts', async (span) => {
        try {
            const query = `
                SELECT 
                    p.id as post_id, 
                    p.author, 
                    p.content as post_content,
                    c.id as comment_id,
                    c.author as comment_author,
                    c.content as comment_content
                FROM posts p
                LEFT JOIN comments c ON c.post_id = p.id
                ORDER BY p.id, c.id
            `;
            
            const result = await pool.query(query);
            
            // Group comments by post
            const posts = result.rows.reduce((acc, row) => {
                if (!acc[row.post_id]) {
                    acc[row.post_id] = {
                        id: row.post_id,
                        author: row.author,
                        content: row.post_content,
                        comments: []
                    };
                }
                if (row.comment_id) {
                    acc[row.post_id].comments.push({
                        id: row.comment_id,
                        content: row.comment_content,
                        comment_author: row.comment_author
                    });
                }
                return acc;
            }, {});

            res.json(Object.values(posts));
        } catch (error) {
            console.log(error);
            span.recordException(error);
            res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
    });
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
