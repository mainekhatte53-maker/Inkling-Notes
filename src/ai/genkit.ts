import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {next} from '@genkit-ai/next';
import {firebase} from '@genkit-ai/firebase';
import {app} from '@/lib/firebase';

export const ai = genkit({
  plugins: [googleAI(), next(), firebase({app})],
  model: 'googleai/gemini-2.5-flash',
});
