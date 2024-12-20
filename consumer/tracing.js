const { trace } = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { AmqplibInstrumentation } = require('@opentelemetry/instrumentation-amqplib');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

const setupTracing = () => {
    const provider = new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: 'consumer-service',
            [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
            [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: 'development',
            [SemanticResourceAttributes.PROCESS_PID]: process.pid,
            [SemanticResourceAttributes.HOST_NAME]: require('os').hostname(),
            [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: `consumer-${process.pid}-${require('os').hostname()}`,
        }),
    });

    const exporter = new JaegerExporter({
        endpoint: 'http://jaeger:14268/api/traces',
    });

    provider.addSpanProcessor(new BatchSpanProcessor(exporter));
    provider.register();

    registerInstrumentations({
        instrumentations: [
            new ExpressInstrumentation(),
            new AmqplibInstrumentation(),
            new HttpInstrumentation(),
            new PgInstrumentation(),
        ],
    });

    return trace.getTracer('consumer-service');
};

module.exports = { setupTracing };
