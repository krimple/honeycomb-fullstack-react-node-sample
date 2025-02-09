import * as ts from "typescript";

export function asyncToPromiseTransformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
    return (context: ts.TransformationContext) => {
        return (sourceFile: ts.SourceFile) => {
            function visit(node: ts.Node): ts.Node {
                // Transform async functions into promise-based functions
                if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
                    if (node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.AsyncKeyword)) {
                        const newModifiers = node.modifiers?.filter(mod => mod.kind !== ts.SyntaxKind.AsyncKeyword);

                        let body = node.body;
                        if (ts.isBlock(body)) {
                            // Convert `await` expressions to `.then()`
                            const newStatements = body.statements.map(stmt => transformAwaitExpressions(stmt, context));

                            body = ts.factory.createBlock(newStatements, true);
                        }

                        return ts.factory.updateFunctionDeclaration(
                            node as ts.FunctionDeclaration,
                            newModifiers,
                            node.asteriskToken,
                            node.name,
                            node.typeParameters,
                            node.parameters,
                            node.type,
                            body
                        );
                    }
                }

                return ts.visitEachChild(node, visit, context);
            }

            function transformAwaitExpressions(node: ts.Node, context: ts.TransformationContext): ts.Node {
                if (ts.isAwaitExpression(node)) {
                    return ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(node.expression, "then"),
                        undefined,
                        [ts.factory.createArrowFunction(undefined, undefined, [], undefined, undefined, node.expression)]
                    );
                }
                return ts.visitEachChild(node, transformAwaitExpressions, context);
            }

            return ts.visitNode(sourceFile, visit);
        };
    };
}
