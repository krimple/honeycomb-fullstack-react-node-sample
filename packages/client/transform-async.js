import * as ts from "typescript";

function transformAsyncToPromise(context) {
    return (sourceFile) => {
        function visit(node) {
            // Convert `await` expressions to `.then()`
            if (ts.isAwaitExpression(node)) {
                return ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(node.expression, "then"),
                    undefined,
                    [
                        ts.factory.createArrowFunction(
                            undefined,
                            undefined,
                            [],
                            undefined,
                            undefined,
                            node.expression
                        )
                    ]
                );
            }

            // Visit all child nodes
            return ts.visitEachChild(node, visit, context);
        }

        return ts.visitNode(sourceFile, visit);
    };
}

// Create a transformer factory that TypeScript will use
export function asyncToPromiseTransformer(program){
    return transformAsyncToPromise;
}
