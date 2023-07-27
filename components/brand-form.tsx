'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Brand, BrandProperty, CreatedBy } from '@/lib/types'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

const questions = [
  {
    question: 'What is your brand name?',
    hint: `Don't worry you can always change this later. Soon we'll be adding a tool to help you and your team brain storm brand names.`
  },
  {
    question: 'What sector does your company operate in?',
    hint: 'Think about the broader industry context. For example: tech, healthcare, finance, etc.'
  },
  {
    question: 'Describe your company in a tweet (280 characters max)',
    hint: 'Try to encapsulate your business mission, service, or product in a succinct and engaging way.'
  },
  {
    question: 'Who are your users/customers?',
    hint: 'Think about their demographics, interests, behaviors, and needs.'
  },
  {
    question: 'What problem are you solving for them?',
    hint: 'Try to identify the primary pain points or needs that your product or service addresses.'
  },
  {
    question: 'What emotional aspirations can you help satisfy for them?',
    hint: 'Consider the deeper emotional needs or desires your product/service fulfills.'
  },
  {
    question: 'How is your solution uniquely addressing this problem for them?',
    hint: 'Identify what sets your solution apart from others in the market.'
  },
  {
    question: 'What are the competitive alternatives to your product?',
    hint: 'Consider both direct competitors and indirect alternatives.'
  },
  {
    question: 'What do you do better than these competitors?',
    hint: 'Identify your key differentiators and competitive advantages.'
  },
  {
    question: 'How are you distinct from these competitors?',
    hint: 'Think about your unique value proposition, brand personality, and the experiences you offer.'
  },
  {
    question:
      'What do you value or champion as a business? (Beyond making profit)',
    hint: 'Consider your company values, mission, and culture.'
  },
  {
    question: 'What do you fight against or oppose?',
    hint: 'Think about the status quo, industry norms, or practices you want to challenge or change.'
  },
  {
    question: 'How will your company change the world?',
    hint: 'Think big. How does your business contribute to social, environmental, or economic changes?'
  }
]

type BrandQuestionsProps = {
  onFormSubmit: (brand: Brand) => void
  userBrand: Brand
}

export function BrandForm({ onFormSubmit, userBrand }: BrandQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const previousAnswers: string[] = Array(questions.length).fill('')
  if (userBrand && userBrand.properties) {
    userBrand.properties.forEach(prop => {
      questions.forEach((question, index) => {
        if (question.question == prop.description) {
          previousAnswers[index] = prop.value as string
        }
      })
    })
  }
  const [answers, setAnswers] = React.useState(previousAnswers)
  const textAreaRefs = React.useRef<(HTMLTextAreaElement | null)[]>([])

  const handleTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const newAnswers = [...answers]
    newAnswers[index] = event.target.value
    setAnswers(newAnswers)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If the enter key was pressed, submit the form
    if (event.key === 'Enter') {
      event.preventDefault()
      nextQuestion()
    }
  }
  const maxCharacterCount = 100
  const nextQuestion = React.useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }, [currentQuestion])
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }
  const handleSubmit = () => {
    // Perform actions with the submitted answers
    answers.forEach((answer, index) => {
      if (answer != '') {
        const question = questions[index].question
        let property = userBrand.properties?.find(prop => {
          return prop.description == question
        })
        if (property) {
          property.value = answer
        } else {
          userBrand.properties = userBrand.properties || []
          userBrand.properties.push({
            createdAt: new Date(),
            createdBy: CreatedBy.User,
            description: question,
            value: answer
          })
        }
      }
    })
    onFormSubmit(userBrand)
    // nextQuestion()
  }
  React.useEffect(() => {
    const textarea = textAreaRefs.current[currentQuestion]
    if (textarea) {
      textarea.focus()
      const value = textarea.value
      textarea.value = ''
      textarea.value = value
    }
  }, [currentQuestion])
  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm">
      {questions.map((question, index) => (
        <div
          key={index}
          className={index === currentQuestion ? 'mt-12' : 'hidden'}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <label
                htmlFor={`question-${index + 1}`}
                className="mb-1 block font-semibold"
              >
                {currentQuestion + 1}/{questions.length} {question.question}
              </label>
            </TooltipTrigger>
            <TooltipContent>{question.hint}</TooltipContent>
          </Tooltip>
          <textarea
            ref={el => (textAreaRefs.current[index] = el)}
            id={`question-${index + 1}`}
            value={answers[index]}
            onChange={event => handleTextChange(event, index)}
            onKeyDown={event => handleKeyDown(event)}
            className="mt-4 w-full rounded border p-2"
          />
        </div>
      ))}
      <div className="mt-8 flex w-full items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prevQuestion}
          className="rounded-full border-2 border-[#E6FE52] bg-transparent px-4 py-1 hover:bg-[#E6FE52] hover:text-black "
        >
          previous
        </Button>
        <Button
          variant="outline"
          className="rounded-full border-2 border-[#E6FE52] bg-transparent px-4 py-1 hover:bg-[#E6FE52] hover:text-black "
        >
          done
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={nextQuestion}
          className="rounded-full border-2 border-[#E6FE52] bg-transparent px-4 py-1 hover:bg-[#E6FE52] hover:text-black "
        >
          next
        </Button>
      </div>
    </form>
  )
}
