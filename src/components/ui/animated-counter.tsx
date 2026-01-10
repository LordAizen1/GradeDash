"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedCounter({ value, duration = 1500 }: { value: number, duration?: number }) {
    const [count, setCount] = useState(0)
    const countRef = useRef(0)
    const startTimeRef = useRef<number | null>(null)
    const frameRef = useRef<number>(0)

    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp
            const progress = timestamp - startTimeRef.current

            if (progress < duration) {
                // Ease out quart
                const ease = 1 - Math.pow(1 - progress / duration, 4);
                const currentCount = ease * value
                setCount(currentCount)
                frameRef.current = requestAnimationFrame(animate)
            } else {
                setCount(value)
            }
        }

        frameRef.current = requestAnimationFrame(animate)

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current)
        }
    }, [value, duration])

    return (
        <span>
            {Nav(count, value % 1 !== 0)}
        </span>
    )
}

function Nav(num: number, isFloat: boolean) {
    if (isFloat) return num.toFixed(2)
    return Math.round(num)
}
