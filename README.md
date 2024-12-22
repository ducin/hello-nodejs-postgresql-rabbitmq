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

## postgres

    psql -U myuser -d mydatabase

    /var/lib/pgadmin/storage/admin_example.com/...

```sql
 -- List all databases
\l
-- or
SELECT datname FROM pg_database;

-- Connect to a specific database
\c mydatabase

-- List all tables in current database
\dt
-- or more detailed view
\dt+
-- or SQL equivalent
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Show detailed information about a specific table
\d+ table_name
```