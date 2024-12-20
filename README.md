# run

    docker-compose up --build

prometheus metrics:

- `rabbitmq_queue_messages` - Current queue size
- `rate(rabbitmq_queue_messages_published_total[5m])` - Message publish rate
- `rabbitmq_queue_consumers` - Number of consumers
