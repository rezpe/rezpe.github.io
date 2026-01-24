import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1';

let transcriber = null;

self.onmessage = async (event) => {
    const { type, audio, model } = event.data;

    if (type === 'load') {
        try {
            self.postMessage({ type: 'loading', message: 'Loading model...' });

            transcriber = await pipeline('automatic-speech-recognition', model, {
                dtype: 'q8',
                device: 'wasm',
                progress_callback: (progress) => {
                    if (progress.status === 'progress') {
                        self.postMessage({
                            type: 'progress',
                            file: progress.file,
                            progress: progress.progress,
                            loaded: progress.loaded,
                            total: progress.total
                        });
                    } else if (progress.status === 'done') {
                        self.postMessage({
                            type: 'file_done',
                            file: progress.file
                        });
                    }
                }
            });

            self.postMessage({ type: 'ready' });
        } catch (error) {
            self.postMessage({ type: 'error', message: error.message });
        }
    } else if (type === 'transcribe') {
        if (!transcriber) {
            self.postMessage({ type: 'error', message: 'Model not loaded' });
            return;
        }

        try {
            const audioDuration = audio.length / 16000; // 16kHz sample rate
            const chunkLength = 30; // seconds per chunk
            const totalChunks = Math.ceil(audioDuration / chunkLength);
            let processedChunks = 0;

            self.postMessage({
                type: 'transcribing',
                totalChunks,
                audioDuration
            });

            const result = await transcriber(audio, {
                chunk_length_s: chunkLength,
                stride_length_s: 5,
                return_timestamps: true,
                chunk_callback: (chunk) => {
                    processedChunks++;
                    const progress = Math.min((processedChunks / totalChunks) * 100, 99);
                    self.postMessage({
                        type: 'transcribe_progress',
                        progress,
                        processedChunks,
                        totalChunks,
                        partialText: chunk.text
                    });
                }
            });

            self.postMessage({ type: 'result', text: result.text });
        } catch (error) {
            self.postMessage({ type: 'error', message: error.message });
        }
    }
};
