'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { CenteredDiv } from './centered-div'
import { kv } from '@vercel/kv';

const brandQuestions = [
  {
    question: 'What is the brand promise and value proposition',
    hint: `What is a "serverless function"?`
  },
  {
    question: 'What sector does your company operate in?',
    hint: 'would a drop down help?'
  },
  {
    question: 'What is the brand’s golden circle ie. the Why? How? and What?',
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
    <CenteredDiv>
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
    </CenteredDiv>
  )
}
