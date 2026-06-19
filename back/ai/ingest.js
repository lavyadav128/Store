import fs from "fs";
// fs = File System — a built-in Node.js module that lets us read/write files and folders on the computer

import path from "path";
// path = a built-in Node.js module that helps us build/join file paths safely (works on Windows, Mac, Linux)

import { createRequire } from "module";
// createRequire lets us use old-style require() inside modern ES module files (files that use "import")

const require = createRequire(import.meta.url);
// Creates a custom require() function tied to the current file's location
// import.meta.url = the full file path of THIS file

const pdfParse = require("pdf-parse");
// pdf-parse is a third-party library that reads PDF files and extracts all the text from them
// We use require() here because pdf-parse is a CommonJS package (old style), not an ES module

import { pipeline } from "@xenova/transformers";
// pipeline is a function from Transformers.js — it loads AI models and lets us run them in Node.js
// We'll use it to load a sentence embedding model (converts text into vectors/numbers)


// ======================================
// EMBEDDING MODEL
// ======================================

console.log("Loading embedding model...");
// Print a message to the terminal so we know the model loading has started (it takes a few seconds)

const embedder = await pipeline(
    "feature-extraction",           // Task type: extract feature vectors (turn text into number arrays)
    "Xenova/all-MiniLM-L6-v2"       // Model name: a small, fast sentence embedding model from Hugging Face
);
// "await" means: wait here until the model is fully downloaded and loaded before continuing
// embedder is now a function — we call it with text to get a vector back

console.log("Embedding model loaded!");
// Confirms the model is ready — printed after the await above finishes


// ======================================
// PATHS
// ======================================

// This section sets up all the folder/file paths we'll need throughout the script

const BASE_DIR = path.resolve();
// path.resolve() with no arguments returns the CURRENT WORKING DIRECTORY (the folder you ran the script from)
// e.g., "/home/user/projects/backend/ai"

const DASH_DIR = path.join(
    BASE_DIR,
    "../../dash"
);
// Go two levels UP from BASE_DIR and into the "dash" folder
// path.join combines path parts safely
// e.g., if BASE_DIR = "/projects/backend/ai", then DASH_DIR = "/projects/dash"

const PDF_DIR = path.join(
    DASH_DIR,
    "public",
    "images"
);
// Path to the folder where PDF files are stored: dash/public/images/
// This is where the script will look for PDF study materials

const JS_DIR = path.join(
    DASH_DIR,
    "src",
    "components"
);
// Path to the folder where JS files are stored: dash/src/components/
// This is where the script will look for JavaScript source code files to index


// VECTOR STORE FILE

const VECTOR_STORE_PATH = path.join(
    BASE_DIR,
    "vector_store.json"
);
// Path where the final vector store (all chunks + embeddings) will be saved as a JSON file
// It gets saved in the BASE_DIR folder as "vector_store.json"


// ======================================
// VECTOR STORAGE
// ======================================

const vectorStore = [];
// An empty array that will COLLECT all the text chunks + their embeddings as we process files
// At the end, this entire array gets saved to vector_store.json


// ======================================
// CHUNK TEXT
// ======================================

// AI models have a limit on how much text they can process at once
// So we split large text into smaller pieces called "chunks"

function chunkText(text, size = 500) {
    // text = the full text to split
    // size = how many characters per chunk (default: 500 characters)

    const chunks = [];
    // Empty array to collect all the chunks

    for (let i = 0; i < text.length; i += size) {
        // Start at 0, jump by "size" each time (500 chars at a time)
        // e.g., i = 0, 500, 1000, 1500, ... until we've gone through all the text

        chunks.push(
            text.slice(i, i + size)
            // text.slice(i, i + size) cuts out a 500-character piece starting at position i
        );
    }

    return chunks;
    // Returns an array of strings, each up to 500 characters long
}


// ======================================
// READ PDF
// ======================================

// Reads a PDF file from disk and returns all its text as a plain string

async function readPDF(filePath) {
    // filePath = the full path to the PDF file on disk

    try {
        // "try" means: attempt the following code, and if anything goes wrong, jump to "catch"

        const dataBuffer =
            fs.readFileSync(filePath);
        // Read the PDF file as raw binary data (a Buffer — Node.js's way of handling binary)
        // readFileSync = read synchronously (wait until done before continuing)

        const data =
            await pdfParse(dataBuffer);
        // pdfParse takes the binary Buffer and extracts all text from the PDF
        // "await" waits for it to finish (it's asynchronous)

        return data.text;
        // data.text = the full plain text extracted from the PDF
        // Return it so the caller can use it

    } catch (err) {
        // If anything goes wrong (file not found, corrupted PDF, etc.), run this block instead

        console.log(
            "PDF Error:",
            filePath
        );
        // Print an error message showing WHICH file failed

        return "";
        // Return an empty string so the rest of the script can continue without crashing
    }
}


// ======================================
// CREATE EMBEDDING
// ======================================

// Converts a piece of text into a vector (array of numbers)
// Vectors let us compare texts mathematically to find similar ones

async function createEmbedding(text) {
    // text = the chunk of text to embed

    const embedding = await embedder(
        text,
        {
            pooling: "mean",    // Average all token embeddings into one single vector for the whole text
            normalize: true     // Scale the vector to length 1 (unit vector) — makes similarity comparison more accurate
        }
    );
    // "await" waits for the embedder model to process the text
    // embedding.data = the raw number array (stored as a Float32Array typed array)

    return Array.from(
        embedding.data
    );
    // Array.from converts the Float32Array into a regular JavaScript array
    // e.g., [0.023, -0.104, 0.578, ...] — hundreds of numbers representing the text's meaning
}


// ======================================
// STORE CHUNK
// ======================================

// Takes one chunk of text, creates its embedding, and pushes everything into the vectorStore array

async function storeChunk(
    chunk,     // The text chunk (a 500-character string)
    metadata   // Extra info about where this chunk came from (filename, type, chunk index)
) {

    const embedding =
        await createEmbedding(chunk);
    // Convert this chunk into a vector by calling the embedding function above

    vectorStore.push({
        // Add a new object to the vectorStore array with 3 things:

        text: chunk,
        // The original text of this chunk (so we can show it to the AI later)

        embedding: embedding,
        // The vector representation of this chunk (so we can compare it to a query vector)

        metadata: metadata
        // Extra info like: { source: "chapter1.pdf", type: "pdf", chunk: 0 }
        // Used later to know WHICH file/chapter a chunk came from
    });
}


// ======================================
// PROCESS FILES
// ======================================

// Walks through a folder (and all subfolders), finds PDF and JS files, and processes each one

async function processFolder(folderPath) {
    // folderPath = the full path to the folder to scan

    const files =
        fs.readdirSync(folderPath);
    // readdirSync reads the folder and returns an array of all file/subfolder names inside it
    // e.g., ["chapter1.pdf", "chapter2.pdf", "images", "notes.js"]

    for (const file of files) {
        // Loop through each item (file or subfolder) in the folder

        const fullPath =
            path.join(folderPath, file);
        // Build the complete path to this item by combining the folder path + the file name
        // e.g., "/projects/dash/public/images/chapter1.pdf"

        const stat =
            fs.statSync(fullPath);
        // stat = file stats object — contains info about the item (is it a file? a folder? how big? etc.)
        // statSync = synchronous (wait for result before continuing)


        // ==============================
        // DIRECTORY
        // ==============================

        if (stat.isDirectory()) {
            // stat.isDirectory() returns true if this item is a FOLDER (not a file)

            await processFolder(fullPath);
            // RECURSION: call processFolder again on this subfolder
            // This makes the function automatically scan ALL subfolders (any depth)
        }


        // ==============================
        // PDF FILES
        // ==============================

        else if (
            file.endsWith(".pdf")
        ) {
            // Check if the file name ends with ".pdf" — if so, it's a PDF file

            console.log(
                `\nReading PDF: ${file}`
            );
            // Print the PDF filename to the terminal so we can track progress
            // \n = newline (blank line before the message for readability)

            const text =
                await readPDF(fullPath);
            // Extract all text from this PDF file using our readPDF function

            const chunks =
                chunkText(text);
            // Split the full text into 500-character chunks using our chunkText function

            for (let i = 0; i < chunks.length; i++) {
                // Loop through every chunk

                await storeChunk(

                    chunks[i],
                    // The text of this specific chunk

                    {
                        source: file,   // Which PDF file this chunk came from
                        type: "pdf",    // Mark it as a PDF source
                        chunk: i        // The index of this chunk (0, 1, 2, ...) within the file
                    }
                );
                // Create an embedding for this chunk and save it to vectorStore

                console.log(
                    `Stored PDF Chunk ${i}`
                );
                // Print progress: tells us which chunk number was just stored
            }
        }


        // ==============================
        // JS FILES
        // ==============================

        else if (
            file.endsWith(".js")
        ) {
            // Check if the file name ends with ".js" — if so, it's a JavaScript source file

            console.log(
                `\nReading JS: ${file}`
            );
            // Print the JS filename to the terminal

            const text =
                fs.readFileSync(
                    fullPath,
                    "utf-8"
                );
            // Read the JS file as plain text (unlike PDFs, JS files are just text — no special parsing needed)
            // "utf-8" tells Node.js to decode the bytes as readable text characters

            const chunks =
                chunkText(text);
            // Split the JS code into 500-character chunks (same as PDFs)

            for (let i = 0; i < chunks.length; i++) {
                // Loop through every chunk

                await storeChunk(

                    chunks[i],
                    // The text of this specific chunk

                    {
                        source: file,   // Which JS file this chunk came from
                        type: "js",     // Mark it as a JS source
                        chunk: i        // The index of this chunk within the file
                    }
                );
                // Create an embedding for this chunk and save it to vectorStore

                console.log(
                    `Stored JS Chunk ${i}`
                );
                // Print progress for each stored JS chunk
            }
        }
    }
}


// ======================================
// START
// ======================================

// This is where the actual script execution begins — all the code above was just function definitions

console.log(
    "\nStarting ingestion...\n"
);
// Print a message to show the ingestion process is beginning

// PDFs
await processFolder(PDF_DIR);
// Process all PDF files in the PDF_DIR folder (dash/public/images/)
// "await" makes sure ALL PDFs are fully processed before moving on

// JS Files
await processFolder(JS_DIR);
// Process all JS files in the JS_DIR folder (dash/src/components/)
// These could be React components or other code files that should be indexed


// ======================================
// SAVE LOCALLY
// ======================================

// After all files are processed, save the entire vectorStore array to disk as a JSON file

fs.writeFileSync(

    VECTOR_STORE_PATH,
    // The file path where we want to save: BASE_DIR/vector_store.json

    JSON.stringify(
        vectorStore,   // The JS array to convert to a JSON string
        null,          // No custom replacer function needed
        2              // Indent with 2 spaces — makes the JSON human-readable (pretty-printed)
    )
);
// writeFileSync writes the file synchronously (waits until the write is complete)
// This saves ALL chunks + embeddings to disk so the chatbot can load them later without re-processing

console.log(
    "\nVector Store Saved Locally!"
);
// Confirm the file was saved successfully

console.log(
    `Saved to: ${VECTOR_STORE_PATH}`
);
// Print the exact file path where vector_store.json was saved — useful to know where to find it