class CalculationService {
    performCalculation(tracer, parentContext) {
        const span = tracer.startSpan('perform_calculation', {
            parent: parentContext,
        });
        
        try {
            // Simulate complex calculation
            const result = Array.from({ length: 1000000 }, (_, i) => i)
                .reduce((sum, current) => sum + current, 0);
            
            span.setAttribute('calculation.result', result);
            return result;
        } finally {
            span.end();
        }
    }
}

module.exports = { CalculationService };
