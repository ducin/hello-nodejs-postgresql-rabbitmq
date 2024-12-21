# run

    docker system df
    docker-compose up --build
    docker volume rm $(docker volume ls -f dangling=true -q)
    docker-compose up --build --force-recreate

For docker-compose the correct way to remove volumes would be `docker-compose down --volumes` or `docker-compose down --rmi all --volumes`.

prometheus metrics:

- `rabbitmq_queue_messages` - Current queue size
- `rate(rabbitmq_queue_messages_published_total[5m])` - Message publish rate
- `rabbitmq_queue_consumers` - Number of consumers
