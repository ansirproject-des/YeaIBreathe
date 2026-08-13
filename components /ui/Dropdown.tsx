"use client"

import React, { useState, useEffect, useRef } from "react"

type DropdownItem = {
  label: string,
  leftIcon?: React.ReactNode,
  rightIcon?: React.ReactNode,
  onClick?: () => void,
  hasBorder?: boolean,
  variant?: "default" | "danger",
}

const alignment = {
  left: "left-0",
  right: "right-0",
};

type DropdownProps = {
  items: DropdownItem[],
  children: React.ReactElement<{ onClick?: () => void }>,
  align?: "left" | "right",
}

export function Dropdown({ items, children, align = "left", }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const triggerButton = React.cloneElement(children, {
    onClick: () => setIsOpen((prev) => !prev),
  })

  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("pointerdown", handleClickOutside)

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block">
      {triggerButton}

      {isOpen && (
        <div className={`absolute mt-1 w-48 rounded-xl bg-app-bg/72 backdrop-blur-xs shadow-sm border border-surface overflow-hidden z-50 ${alignment[align]}`}>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick?.()
                setIsOpen(false)
              }}
              className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-app-gray cursor-pointer
                 ${item.variant === "danger"
                  ? "text-danger"
                  : "text-text"}
                ${item.hasBorder ? "border-t border-surface" : ""}
                `}

            >
              <span className="flex items-center gap-2 text-left">
                {item.leftIcon}
                {item.label}
              </span>
              {item.rightIcon}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}