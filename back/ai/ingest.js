import fs from "fs";
import path from "path";

import { createRequire } from "module";

const require = createRequire(import.meta.url);

const pdfParse = require("pdf-parse");

import { pipeline } from "@xenova/transformers";

// ======================================
// EMBEDDING MODEL
// ======================================

console.log("Loading embedding model...");

const embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
);

console.log("Embedding model loaded!");

// ======================================
// PATHS
// ======================================

const BASE_DIR = path.resolve();

const DASH_DIR = path.join(
    BASE_DIR,
    "../../dash"
);

const PDF_DIR = path.join(
    DASH_DIR,
    "public",
    "images"
);

const JS_DIR = path.join(
    DASH_DIR,
    "src",
    "components"
);

// VECTOR STORE FILE

const VECTOR_STORE_PATH = path.join(
    BASE_DIR,
    "vector_store.json"
);

// ======================================
// VECTOR STORAGE
// ======================================

const vectorStore = [];

// ======================================
// CHUNK TEXT
// ======================================

function chunkText(text, size = 500) {

    const chunks = [];

    for (let i = 0; i < text.length; i += size) {

        chunks.push(
            text.slice(i, i + size)
        );
    }

    return chunks;
}

// ======================================
// READ PDF
// ======================================

async function readPDF(filePath) {

    try {

        const dataBuffer =
            fs.readFileSync(filePath);

        const data =
            await pdfParse(dataBuffer);

        return data.text;

    } catch (err) {

        console.log(
            "PDF Error:",
            filePath
        );

        return "";
    }
}

// ======================================
// CREATE EMBEDDING
// ======================================

async function createEmbedding(text) {

    const embedding = await embedder(
        text,
        {
            pooling: "mean",
            normalize: true
        }
    );

    return Array.from(
        embedding.data
    );
}

// ======================================
// STORE CHUNK
// ======================================

async function storeChunk(
    chunk,
    metadata
) {

    const embedding =
        await createEmbedding(chunk);

    vectorStore.push({

        text: chunk,

        embedding: embedding,

        metadata: metadata
    });
}

// ======================================
// PROCESS FILES
// ======================================

async function processFolder(folderPath) {

    const files =
        fs.readdirSync(folderPath);

    for (const file of files) {

        const fullPath =
            path.join(folderPath, file);

        const stat =
            fs.statSync(fullPath);

        // ==============================
        // DIRECTORY
        // ==============================

        if (stat.isDirectory()) {

            await processFolder(fullPath);
        }

        // ==============================
        // PDF FILES
        // ==============================

        else if (
            file.endsWith(".pdf")
        ) {

            console.log(
                `\nReading PDF: ${file}`
            );

            const text =
                await readPDF(fullPath);

            const chunks =
                chunkText(text);

            for (let i = 0; i < chunks.length; i++) {

                await storeChunk(

                    chunks[i],

                    {
                        source: file,
                        type: "pdf",
                        chunk: i
                    }
                );

                console.log(
                    `Stored PDF Chunk ${i}`
                );
            }
        }

        // ==============================
        // JS FILES
        // ==============================

        else if (
            file.endsWith(".js")
        ) {

            console.log(
                `\nReading JS: ${file}`
            );

            const text =
                fs.readFileSync(
                    fullPath,
                    "utf-8"
                );

            const chunks =
                chunkText(text);

            for (let i = 0; i < chunks.length; i++) {

                await storeChunk(

                    chunks[i],

                    {
                        source: file,
                        type: "js",
                        chunk: i
                    }
                );

                console.log(
                    `Stored JS Chunk ${i}`
                );
            }
        }
    }
}

// ======================================
// START
// ======================================

console.log(
    "\nStarting ingestion...\n"
);

// PDFs
await processFolder(PDF_DIR);

// JS Files
await processFolder(JS_DIR);

// ======================================
// SAVE LOCALLY
// ======================================

fs.writeFileSync(

    VECTOR_STORE_PATH,

    JSON.stringify(
        vectorStore,
        null,
        2
    )
);

console.log(
    "\nVector Store Saved Locally!"
);

console.log(
    `Saved to: ${VECTOR_STORE_PATH}`
);