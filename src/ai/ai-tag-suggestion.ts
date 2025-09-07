// src/ai/ai-tag-suggestion.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant tags for notes based on their content.
 *
 * @exports suggestTags - An async function that takes note content as input and returns a list of suggested tags.
 * @exports SuggestTagsInput - The input type for the suggestTags function.
 * @exports SuggestTagsOutput - The output type for the suggestTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  noteContent: z
    .string()
    .describe('The content of the note for which tags are to be suggested.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the note content.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const suggestTagsPrompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `You are an AI assistant designed to suggest relevant tags for a note based on its content.

  Given the following note content, please suggest a list of tags that would be helpful for categorizing and finding this note later.

  Note Content:
  {{noteContent}}

  Please provide the tags as a JSON array of strings. Focus on tags that are specific, descriptive, and relevant to the content.
  For example, a note about React state management could have tags like ["React", "state management", "hooks", "useState"].
  Don't return duplicates.
  Ensure each tag is no more than 3 words.
  `,
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async (input) => {
    const {output} = await suggestTagsPrompt(input);
    return output!;
  }
);
