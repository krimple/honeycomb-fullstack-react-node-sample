import * as ts from "typescript";
import { asyncToPromiseTransformer } from "./transform-async.js";

// Compiler options
const configPath = ts.findConfigFile("./", ts.sys.fileExists, "tsconfig.json");
if (!configPath) {
    throw new Error("Could not find tsconfig.json");
}

const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, "./");

// Create a custom program
const program = ts.createProgram(config.fileNames, config.options);
const emitResult = program.emit(undefined, undefined, undefined, undefined, {
    before: [asyncToPromiseTransformer(program)]
});

// Handle errors
const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
        const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
        console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }
});

if (emitResult.emitSkipped) {
    console.error("Compilation failed.");
    process.exit(1);
} else {
    console.log("Compilation successful.");
}
