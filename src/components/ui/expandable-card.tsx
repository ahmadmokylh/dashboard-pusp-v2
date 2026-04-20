import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '#/lib/utils'
import { Badge } from './badge'
import { Image, Plus, X } from 'lucide-react'

interface ExpandableCardProps {
  title: string
  preview: string | null
  description: string
  children?: React.ReactNode
  className?: string
  classNameExpanded?: string
  category: string
  [key: string]: any
  price: number
  finalPrice: number
  saved: number
}

export function ExpandableCard({
  title,
  preview,
  description,
  children,
  className,
  classNameExpanded,
  category,
  price,
  finalPrice,
  saved,
  ...props
}: ExpandableCardProps) {
  const [active, setActive] = React.useState(false)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const id = React.useId()

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActive(false)
      }
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setActive(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full bg-white/50 backdrop-blur-md dark:bg-black/50"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div
            dir="rtl"
            className={cn(
              'fixed inset-0 z-100 grid place-items-center  before:pointer-events-none ',
            )}
          >
            <motion.div
              layoutId={`card-${title}-${id}`}
              ref={cardRef}
              className={cn(
                'relative flex h-full  w-full bottom-19 max-w-[850px] flex-col overflow-auto bg-zinc-50 shadow-sm [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] sm:rounded-t-3xl dark:bg-zinc-950 dark:shadow-none',
                classNameExpanded,
              )}
              {...props}
            >
              <motion.div layoutId={`image-${title}-${id}`}>
                <div className="relative before:absolute before:inset-x-0 before:-bottom-px before:z-50 before:h-[70px] before:bg-linear-to-t before:from-zinc-50 dark:before:from-zinc-950">
                  {preview ? (
                    <img
                      src={preview}
                      alt={title}
                      className="h-80 w-full object-cover object-center"
                    />
                  ) : (
                    <Image className="text-muted-foreground/20" />
                  )}
                </div>
              </motion.div>
              <div className="relative h-full before:fixed before:inset-x-0 before:bottom-0 before:z-50 before:h-[70px] before:bg-linear-to-t before:from-zinc-50 dark:before:from-zinc-950">
                <div className="flex h-auto items-start justify-between p-8">
                  <div className="flex flex-col gap-5">
                    <Badge>{category}</Badge>
                    <motion.h3
                      layoutId={`title-${title}-${id}`}
                      className="mt-0.5 text-4xl font-semibold text-black sm:text-4xl dark:text-white"
                    >
                      {title}
                    </motion.h3>
                  </div>
                  <motion.button
                    aria-label="Close card"
                    layoutId={`button-${title}-${id}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200/90 bg-zinc-50 text-neutral-700 transition-colors duration-300 hover:border-gray-300/90 hover:bg-neutral-50 hover:text-black focus:outline-none dark:border-zinc-900 dark:bg-zinc-950 dark:text-white/70 dark:hover:border-zinc-800 dark:hover:bg-neutral-950 dark:hover:text-white"
                    onClick={() => setActive(false)}
                  >
                    <motion.div transition={{ duration: 0.4 }}>
                      <X size={20} />
                    </motion.div>
                  </motion.button>
                </div>
                <div className="relative px-6 sm:px-8">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-start gap-4 overflow-auto whitespace-pre-line pb-10 text-base text-zinc-500 dark:text-zinc-400"
                  >
                    {children}
                    {price > 0 && (
                      <div className="flex items-baseline gap-1.5 pt-0.5">
                        <span
                          className={cn(
                            'text-3xl font-semibold',
                            saved > 0 && 'text-green-600 dark:text-green-400',
                          )}
                        >
                          $
                          {saved > 0 ? finalPrice.toFixed(2) : price.toFixed(2)}
                        </span>
                        {saved > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        role="dialog"
        aria-labelledby={`card-title-${id}`}
        aria-modal="true"
        layoutId={`card-${title}-${id}`}
        onClick={() => setActive(true)}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-between rounded-2xl border border-gray-200/70 bg-zinc-50 p-3 mx-auto shadow-sm dark:border-zinc-900 dark:bg-zinc-950 dark:shadow-none',
          className,
        )}
      >
        <div className="flex flex-col gap-4">
          <motion.div layoutId={`image-${title}-${id}`}>
            {preview ? (
              <img
                src={preview}
                alt={title}
                className="h-56 w-64 rounded-lg object-cover object-center"
              />
            ) : (
              <div className="h-56 w-58 bg-muted/50 rounded-lg flex items-center justify-center">
                <Image className="text-muted-foreground/20" />
              </div>
            )}
          </motion.div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Badge>{category}</Badge>

              <motion.h3
                layoutId={`title-${title}-${id}`}
                className="font-semibold text-black md:text-start dark:text-white"
              >
                {title}
              </motion.h3>

              <motion.p
                layoutId={`description-${description}-${id}`}
                className="text-sm font-medium text-zinc-500 md:text-start dark:text-zinc-400 line-clamp-1"
              >
                {description}
              </motion.p>

              {price > 0 && (
                <div className="flex items-baseline gap-1.5 pt-0.5">
                  <span
                    className={cn(
                      'text-base font-semibold',
                      saved > 0 && 'text-green-600 dark:text-green-400',
                    )}
                  >
                    ${saved > 0 ? finalPrice.toFixed(2) : price.toFixed(2)}
                  </span>
                  {saved > 0 && (
                    <span className="text-xs text-muted-foreground line-through">
                      ${price.toFixed(2)}
                    </span>
                  )}
                </div>
              )}
            </div>
            <motion.button
              aria-label="Open card"
              layoutId={`button-${title}-${id}`}
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200/90 bg-zinc-50 text-neutral-700 transition-colors duration-300 hover:border-gray-300/90 hover:bg-neutral-50 hover:text-black focus:outline-none dark:border-zinc-900 dark:bg-zinc-950 dark:text-white/70 dark:hover:border-zinc-800 dark:hover:bg-neutral-950 dark:hover:text-white',
                className,
              )}
            >
              <motion.div
                animate={{ rotate: active ? 45 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <Plus size={16} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
