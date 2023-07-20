import React from 'react'
import { Button } from './ui/button'
import { IconArrowLeft, IconArrowRight } from './ui/icons'

type CircleSelectorProps = {
  options: Array<string>
  title: string
  index?: number
}

export function CircleSelector({
  options,
  title,
  index = 1
}: CircleSelectorProps) {
  const [currentIndex, setCurrentIndex] = React.useState(index)
  const textareaRef = React.useRef(null)

  return (
    <>
      <section>
        <h2 className="text-4xl font-bold mb-4 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : 0))}
            disabled={currentIndex < 1}
          >
            <IconArrowLeft />
          </Button>
          {title}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setCurrentIndex(prev =>
                prev < options.length - 1 ? prev + 1 : options.length - 1
              )
            }
            disabled={currentIndex > options.length - 2}
          >
            <IconArrowRight />
          </Button>
        </h2>
        <textarea
          ref={textareaRef}
          className="resize-none bg-transparent border-0 focus:border-blue-500 rounded p-2 w-full xl:h-[200px] md:h-[150px] sm:h-[200px] xs:h-[300px]"
          value={options[currentIndex]}
        ></textarea>
        <div className="flex justify-end">
          <Button>Save</Button>
        </div>
      </section>
    </>
  )
}
