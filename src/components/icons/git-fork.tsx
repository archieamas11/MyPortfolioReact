import type { SVGMotionProps, Variants } from 'motion/react'
import { motion, useAnimation } from 'motion/react'
import { forwardRef, type MouseEventHandler, useCallback, useImperativeHandle, useRef } from 'react'

import { cn } from '@/lib/utils'

export interface FolderCodeIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface FolderCodeIconProps extends Omit<SVGMotionProps<SVGSVGElement>, 'onMouseEnter' | 'onMouseLeave'> {
  onMouseEnter?: MouseEventHandler<SVGSVGElement>
  onMouseLeave?: MouseEventHandler<SVGSVGElement>
  size?: number
}

const CODE_VARIANTS: Variants = {
  normal: { x: 0, rotate: 0, opacity: 1 },
  animate: (direction: number) => ({
    x: [0, direction * 2, 0],
    rotate: [0, direction * -8, 0],
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  }),
}

const FolderCodeIcon = forwardRef<FolderCodeIconHandle, FolderCodeIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation()
    const isControlledRef = useRef(false)

    useImperativeHandle(ref, () => {
      isControlledRef.current = true
      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      }
    })

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<SVGSVGElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e)
        } else {
          controls.start('animate')
        }
      },
      [controls, onMouseEnter],
    )

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<SVGSVGElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e)
        } else {
          controls.start('normal')
        }
      },
      [controls, onMouseLeave],
    )

    return (
      <motion.svg
        className={cn(className)}
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <title>Folder with code branches</title>
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
        <motion.path
          animate={controls}
          custom={-1}
          d="M10 10.5 8 13l2 2.5"
          initial="normal"
          variants={CODE_VARIANTS}
        />
        <motion.path
          animate={controls}
          custom={1}
          d="m14 10.5 2 2.5-2 2.5"
          initial="normal"
          variants={CODE_VARIANTS}
        />
      </motion.svg>
    )
  },
)

FolderCodeIcon.displayName = 'FolderCodeIcon'

export { FolderCodeIcon }
