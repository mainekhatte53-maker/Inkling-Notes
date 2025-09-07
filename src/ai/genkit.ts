import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {next} from '@genkit-ai/next';
import {firebase} from '@genkit-ai/firebase';

export const ai = genkit({
  plugins: [googleAI(), next(), firebase()],
  model: 'googleai/gemini-2.5-flash',
});
