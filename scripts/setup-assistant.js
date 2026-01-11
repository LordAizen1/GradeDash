const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

async function main() {
    console.log('--- Starting GradeDash Bot Setup ---');

    // 1. Get API Key from .env.local
    let apiKey = process.env.OPENAI_API_KEY;
    const envLocalPath = path.join(__dirname, '..', '.env.local');

    if (!apiKey && fs.existsSync(envLocalPath)) {
        console.log('Reading .env.local...');
        const content = fs.readFileSync(envLocalPath, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('OPENAI_API_KEY=')) {
                // Handle potential quotes
                let val = trimmed.split('=')[1].trim();
                val = val.replace(/^["'](.*)["']$/, '$1');
                apiKey = val;
                break;
            }
        }
    }

    if (!apiKey) {
        console.error('ERROR: Could not find OPENAI_API_KEY in .env.local');
        process.exit(1);
    }

    console.log('API Key verified.');
    const openai = new OpenAI({ apiKey });
    console.log('OpenAI Instance Keys:', Object.keys(openai));
    if (openai.beta) {
        console.log('OpenAI Beta Keys:', Object.keys(openai.beta));
    } else {
        console.log('OpenAI Beta is undefined');
    }

    // 2. Check Files
    const regulationsDir = path.join(__dirname, '..', 'public', 'regulations');
    if (!fs.existsSync(regulationsDir)) {
        console.error('ERROR: public/regulations folder missing');
        process.exit(1);
    }

    const files = fs.readdirSync(regulationsDir).filter(f => f.endsWith('.pdf') || f.endsWith('.txt'));
    if (files.length === 0) {
        console.error('ERROR: No files in public/regulations');
        process.exit(1);
    }
    console.log(`Found ${files.length} regulation files.`);

    try {
        // 3. Create Vector Store
        console.log('Creating Vector Store "IIITD Regulations Store"...');
        const vectorStore = await openai.beta.vectorStores.create({
            name: "IIITD Regulations Store",
        });
        console.log('Vector Store Created:', vectorStore.id);

        // 4. Upload Files
        console.log('Uploading files...');
        const fileStreams = files.map(file => {
            const filePath = path.join(regulationsDir, file);
            return fs.createReadStream(filePath);
        });

        await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {
            files: fileStreams
        });
        console.log('Files uploaded successfully.');

        // 5. Create Assistant
        console.log('Creating Assistant "GradeDash Guide"...');
        const assistant = await openai.beta.assistants.create({
            name: "GradeDash Guide",
            instructions: "You are GradeDash Guide, a friendly and helpful academic assistant for IIIT Delhi B.Tech students. Your goal is to answer queries about graduation requirements, courses, and regulations accurately using the provided regulation documents. Always cite the specific regulation or section if possible (e.g., 'According to the CSE Regulations...'). If the information is not in the documents, strictly state that you don't know and advise consulting the academic office. Keep responses concise, supportive, and well-structured using Markdown.",
            model: "gpt-4o-mini",
            tools: [{ type: "file_search" }],
            tool_resources: {
                file_search: {
                    vector_store_ids: [vectorStore.id]
                }
            }
        });

        console.log('--------------------------------------------------');
        console.log('SETUP COMPLETE!');
        console.log('--------------------------------------------------');
        console.log('Add this line to your .env.local file:');
        console.log(`ASSISTANT_ID=${assistant.id}`);
        console.log('--------------------------------------------------');

    } catch (error) {
        console.error('Setup Failed:', error);
    }
}

main();
