FROM rabbitmq:3-management

RUN rabbitmq-plugins enable --offline rabbitmq_management

EXPOSE 5672 5672
EXPOSE 15672 15672

CMD ["rabbitmq-server"]
