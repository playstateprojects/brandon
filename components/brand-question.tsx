'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { CenteredDiv } from './centered-div'
import { Brand, BrandProperty, CreatedBy } from '@/lib/types'

const brandQuestions = [
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

export function BrandQuestions({
  onFormSubmit,
  userBrand
}: BrandQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0)

  if (userBrand) {
    userBrand.properties = brandQuestions.map(question => {
      return {
        createdAt: new Date(),
        description: question.question,
        createdBy: CreatedBy.User,
        value: userBrand.properties?.find(prop => {
          return (prop.description = question.question)
        })?.value
      } as BrandProperty
    })
  } else {
    return <></>
  }
  const [text, setText] = React.useState(
    userBrand.properties[0].value ? userBrand.properties[0].value : ''
  )
  const [brand, setBrand] = React.useState(userBrand)
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target
    setText(value)
  }

  const maxCharacterCount = 100
  const completeQuestions = React.useCallback(() => {
    onFormSubmit(brand as Brand) // Call onFormSubmit callback with brand data
  }, [brand, onFormSubmit])
  const nextQuestion = React.useCallback(
    (increment: number = 1) => {
      setBrand(prevBrand => {
        const updatedProperties = prevBrand.properties
          ? [...prevBrand.properties]
          : []
        updatedProperties[currentQuestion].value = text
        return { ...prevBrand, properties: updatedProperties }
      })
      setText('')
      if (increment < 0) {
        const newIndex = Math.max(currentQuestion + increment, 0)
        setCurrentQuestion(newIndex)
      } else if (currentQuestion < brandQuestions.length - increment) {
        setCurrentQuestion(prevQuestion => prevQuestion + increment)
        if (
          userBrand.properties &&
          userBrand.properties[currentQuestion].value
        ) {
          setText(userBrand.properties[currentQuestion].value as string)
        }
      } else {
        const incompleteProperty = brand.properties?.find(prop => !prop.value)
        if (incompleteProperty) {
          setCurrentQuestion(0)
        } else {
          completeQuestions()
        }
      }
      // if (brand.properties && brand.properties[currentQuestion].value) {
      //   setText(brand.properties[currentQuestion].value as string)
      // }
    },
    [brand, brandQuestions, currentQuestion, completeQuestions, text]
  )
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
        <p className="text-gray-500">
          {text.length}/{maxCharacterCount}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            nextQuestion(-1)
          }}
          className="bg-background"
        >
          previous
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            nextQuestion(1)
          }}
          className="bg-background"
        >
          next
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            completeQuestions()
          }}
          className="bg-background"
        >
          Done
        </Button>
      </div>
    </CenteredDiv>
  )
}
