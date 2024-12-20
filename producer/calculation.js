class CalculationService {
    performCalculation(tracer, parentContext) {
        const span = tracer.startSpan('perform_calculation', {
            parent: parentContext,
        });
        
        try {
            // Simulate complex calculation
            const orderOfMagnitude = Math.floor(Math.random() * 6) + 1;
            const result = Array.from({ length: orderOfMagnitude }, (_, i) => i)
                .reduce((sum, current) => sum + current, 0);
            
            span.setAttribute('calculation.result', result);
            return result;
        } finally {
            span.end();
        }
    }
}

module.exports = { CalculationService };
