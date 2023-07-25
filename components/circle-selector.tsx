import React from 'react'
import { Button } from './ui/button'
import { IconArrowLeft, IconArrowRight } from './ui/icons'

type CircleSelectorProps = {
  initialOptions: Array<string>
  title: string
  index?: number
  saveFunction: (value: string) => void
}

export function CircleSelector({
  initialOptions,
  title,
  index = 1,
  saveFunction
}: CircleSelectorProps) {
  const [options, setOptions] = React.useState(initialOptions)
  const [currentIndex, setCurrentIndex] = React.useState(index)
  const textareaRef = React.useRef(null)
  React.useEffect(() => {
    setOptions([...initialOptions])
  }, [initialOptions])
  React.useEffect(() => {
    setCurrentIndex(index)
  }, [index])
  const handleTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const newOptions = [...options]
    newOptions[index] = event.target.value
    setOptions(newOptions)
  }

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
          className="resize-auto border border-custom-green border-opacity-20 bg-gradient-to-r from-background to-muted p-4  border-1 focus:border-black-100 rounded p-2 w-full xl:h-[200px] md:h-[150px] sm:h-[200px] xs:h-[300px]"
          value={options[currentIndex]}
          onChange={event => handleTextChange(event, currentIndex)}
        ></textarea>
        <div className="flex justify-end my-4">
          <p className="text-xs text-white txt">
            {options[currentIndex].length}
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => saveFunction(options[currentIndex])}>
            Save
          </Button>
        </div>
      </section>
    </>
  )
}
