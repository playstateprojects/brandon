const templates = {
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
