// Pulled hastily from a ChatGPT question to generate random word chunks
// this example uses the OpenTelemetry API to grap the

const { trace , context, SpanStatusCode} = require('@opentelemetry/api');
const tracer = trace.getTracer('sentence-generator', '1.0.0');

module.exports = function generateNonsenseSentence() {
    const words = [
        "apple", "banana", "cat", "dog", "elephant", "flower", "giraffe", "house",
        "ice", "jungle", "kite", "lion", "mountain", "notebook", "orange", "panda",
        "queen", "robot", "sun", "tiger", "umbrella", "vase", "wolf", "xylophone",
        "yacht", "zebra"
    ];

    let sentence = [], combinedSentence;
    // grab the current trace's span
    const thing = tracer.startActiveSpan('generate-sentence', span => {
        try {
            for (let i = 0; i < 7; i++) {
                const randomIndex = Math.floor(Math.random() * words.length);
                sentence.push(words[randomIndex]);
            }

            combinedSentence = sentence.join(' ') + '.';

            // add the sentence as an event for the span
            span.setAttribute("sentence-created", combinedSentence);
        } catch (err) {
            console.error(err);
           span.setStatus({
               code: SpanStatusCode.ERROR,
               message: err.message
           })
        } finally {
           span?.end();
           // return thing;
        }
    });
    return combinedSentence;
}
