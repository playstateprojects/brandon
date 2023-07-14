'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'

const brandQuestions = [
  {
    question: 'What is the brand promise and value propositionWhat sector does your company operate in?',
    hint: `What is a "serverless function"?`
  },
  {
    question: 'Summarize an article',
    hint: 'Summarize the following article for a 2nd grader: \n'
  },
  {
    question: 'Draft an email',
    hint: `Draft an email to my boss about the following: \n`
  }
]




export function BrandQuestions() {
    const [currentQuestion, setCurrentQuestion] = React.useState(0)
    const [text, setText] = React.useState('');
    const handleChange = (event:React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      setText(value);
    };
  const maxCharacterCount = 100;
    const nextQuestion = ()=>{
        if(currentQuestion < brandQuestions.length -1){
            setCurrentQuestion(currentQuestion +1)
        }else{
            setCurrentQuestion(0)
        }
    }
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          {brandQuestions[currentQuestion].question}
        </h1>
        <textarea
        className="w-full h-24 p-2 border border-gray-300 rounded"
        value={text}
        onChange={handleChange}
      />
      <p className="text-gray-500">{text.length}/{maxCharacterCount}</p>
        <Button
          variant="outline"
          onClick={nextQuestion}
          className="bg-background"
        >
          next
        </Button>
      </div>
    </div>
  )
}
