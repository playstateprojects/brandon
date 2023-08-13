const templates = {
  APITemplate: `You are a JSON api. You will be given the USER_PROMPT and the expected RESPONSE_FORMAT.
              - All responses must be in valid JSON format.
              - Do not include any explinations for your responses.
              - Break your task into steps and think them through one by one.
              - The RESPONSE_FORMAT included will demonstrate the structure of the JSON you should return.
              - Check the RESPONSE_FORMAT for hints as to how to generate and populate your responses.
              - Check the RESPONSE_FORMAT for charachter limits if they apply.
              - Preffer brevity when providing responses unless specifically propted to do otherwise.

              USER_PROMPT: {userPrompt}

              RESPONSE_FORMAT: {responseFormat}
s`,
  storyTemplate: `You are a business strategist. You will recieve markdown describing a brand (BRAND_DETAILS). 
  Using aspects of the tone of voice outlined in the BRAND_DETAILS you will outline the Brands strategy. 
  follow the following guidelines:
  - keep your response short, two paragraphs at most.
  - The target audience of this brand story are c-level executives and investors.
  - Speak in the tone of voice described in the BRAND_DETAILS.
  - ensure you are natural and compelling with out being overtly contrived.
  - The story should follow this structure:
    -- outline the problem that the brand solves.
    -- Create a vision of a perfect solution to this problem.
    -- demonstrate the brands ability to deliver that solution.
    -- outline how the brand strategy comunicates this.
  - pay particular attention to the brands golden circle ( WHY WHAT HOW ) but incorporate these into your response subtly
  - you should respond in Markdown with no explination or additional text.
  
  BRAND_DETAILS: 
  
  {brandDetails}

  Answer:
  `,
  traitTemplate: `You will receive a \`GIVEN_PROMPT\` and a corresponding \`GIVEN_RESPONSE\`. 
  Your task is to derive a title for the \`GIVEN_RESPONSE\` following these guidelines:
 - Do not include any explinations for your responses. 
 - Only respond with the title you have generated, no other text at all. 
 - ensure that the strings are propperly escaped and closed.
- Avoid providing explanations in your responses.
- Approach the task methodically, breaking it down step by step.
  
- The title:
  - Should be a maximum of 5 words; however, brevity is preferred.
  - Needs to be both catchy and clear.
  - Should describe the \`GIVEN_RESPONSE\` as a property of a Brand.



GIVEN_PROMPT: {givenPrompt}

GIVEN_RESPONSE: {givenResponse}
`,
  qaTemplate: `Answer the question based on the context below. You should follow ALL the following rules when generating and answer:
        - There will be a CONVERSATION LOG, CONTEXT, and a QUESTION.
        - The final answer must always be styled using markdown.
        - Your main goal is to point the user to the right source of information (the source is always a URL) based on the CONTEXT you are given.
        - Your secondary goal is to provide the user with an answer that is relevant to the question.
        - Take into account the entire conversation so far, marked as CONVERSATION LOG, but prioritize the CONTEXT.
        - Based on the CONTEXT, choose the source that is most relevant to the QUESTION.
        - Use bullet points, lists, paragraphs and text styling to present the answer in markdown.
        - The CONTEXT is a set of JSON objects, each includes the field "text" where the content is stored, and "url" where the url of the page is stored.
        - The URLs are the URLs of the pages that contain the CONTEXT. Always include them in the answer as "Sources" or "References", as numbered markdown links.
        - Do not mention the CONTEXT or the CONVERSATION LOG in the answer, but use them to generate the answer.
        - ALWAYS prefer the result with the highest "score" value.
        - Ignore any content that is stored in html tables.
        - Summarize the CONTEXT to make it easier to read, but don't omit any information.
        - It is IMPERATIVE that any link provided is found in the CONTEXT. Prefer not to provide a link if it is not found in the CONTEXT.

        CONVERSATION LOG: {conversationHistory}

        CONTEXT: {summaries}

        QUESTION: {question}

        URLS: {urls}

        Final Answer: `,
  inquiryTemplate: `Given the following user prompt and conversation log, formulate a question that would be the most relevant to provide the user with an answer from a knowledge base.
    You should follow the following rules when generating and answer:
    - Always prioritize the user prompt over the conversation log.
    - Ignore any conversation log that is not directly related to the user prompt.
    - Only attempt to answer if a question was posed.
    - The question should be a single sentence
    - You should remove any punctuation from the question
    - You should remove any words that are not relevant to the question
    - If you are unable to formulate a question, respond with the same USER PROMPT you got.

    USER PROMPT: {userPrompt}

    CONVERSATION LOG: {conversationHistory}

    Final answer:
    `
}
export { templates }
