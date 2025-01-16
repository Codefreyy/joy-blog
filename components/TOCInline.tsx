'use client'

import { Toc } from 'pliny/mdx-plugins/remark-toc-headings'
import React, { useEffect, useState } from 'react'
import { cn } from 'scripts/utils/tailwind-helpers'

type TocItem = {
  value: string
  url: string
  depth: number
  active?: boolean
}

export interface TOCInlineProps {
  toc: Toc
  title?: string
  fromHeading?: number
  toHeading?: number
  asDisclosure?: boolean
  exclude?: string | string[]
  collapse?: boolean
  ulClassName?: string
  liClassName?: string
  rightAlign?: boolean
}

export interface NestedTocItem extends TocItem {
  children?: NestedTocItem[]
}

const createNestedList = (items: TocItem[]): NestedTocItem[] => {
  const nestedList: NestedTocItem[] = []
  const stack: NestedTocItem[] = []

  items.forEach((item) => {
    const newItem: NestedTocItem = { ...item }
    while (stack.length > 0 && stack[stack.length - 1].depth >= newItem.depth) {
      stack.pop()
    }
    const parent = stack.length > 0 ? stack[stack.length - 1] : null
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(newItem)
    } else {
      nestedList.push(newItem)
    }
    stack.push(newItem)
  })

  return nestedList
}

const TOCInline = ({
  toc,
  title = 'Table of Contents',
  fromHeading = 1,
  toHeading = 6,
  asDisclosure = false,
  exclude = '',
  collapse = true,
  ulClassName = '',
  liClassName = '',
  rightAlign = false,
}: TOCInlineProps) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  const re = Array.isArray(exclude)
    ? new RegExp('^(' + exclude.join('|') + ')$', 'i')
    : new RegExp('^(' + exclude + ')$', 'i')

  const filteredToc = toc.filter(
    (heading) =>
      heading.depth >= fromHeading && heading.depth <= toHeading && !re.test(heading.value)
  )

  const handleScroll = () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    // const scrollPosition = window.scrollY || document.documentElement.scrollTop

    let currentId = ''
    headings.forEach((heading, index) => {
      const id = heading.getAttribute('id')
      if (id) {
        const rect = heading.getBoundingClientRect()
        if (index === 1 && rect.top <= 350) {
          currentId = id
        } else if (rect.top <= 200) {
          currentId = id
        }
      }
    })

    setActiveId(currentId)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleClick = (event, headingId) => {
    event.preventDefault() // Prevent the default anchor link behavior
    handleScrollToHeading(headingId)
  }

  const handleScrollToHeading = (headingId) => {
    const headingElement = document.getElementById(headingId)
    if (headingElement) {
      const offset = 20
      const scrollY = headingElement.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top: scrollY, behavior: 'smooth' })
    }
  }

  const createList = (items: NestedTocItem[] | undefined, level = 0) => {
    if (!items || items.length === 0) {
      return null
    }
    return (
      <ul
        className={ulClassName}
        style={{
          [rightAlign ? 'marginRight' : 'marginLeft']: `${level == 0 ? level + 1.5 : level}rem`,
        }}
      >
        {items.map((item, index) => (
          <li key={index} className={liClassName}>
            <button
              onClick={(event) => handleClick(event, item.url.substring(1, item.url.length))}
              className={`${cn(
                'mb-1 inline-block',
                (item.url.substring(1, item.url.length) === activeId || item.active) &&
                  'active-header'
              )} max-w-60 cursor-pointer  truncate hover:opacity-80`}
            >
              {item.value}
            </button>
            {createList(item.children, level + 1)}
          </li>
        ))}
      </ul>
    )
  }

  const nestedList = createNestedList(filteredToc)

  return (
    <>
      {!asDisclosure && (
        <div className={`pb-2 pt-2 text-base font-bold ${rightAlign ? 'mr-6 text-right' : 'ml-6'}`}>
          {title}
        </div>
      )}
      {asDisclosure ? (
        <details open={!collapse}>
          <summary
            className={`pb-2 pt-2 text-xl font-bold ${rightAlign ? 'mr-6 text-right' : 'ml-6'}`}
          >
            Table of Contents
          </summary>
          <div className={`${rightAlign ? 'mr-6' : 'ml-6'} h-[700px] overflow-y-auto`}>
            {createList(nestedList)}
          </div>
        </details>
      ) : (
        <div className="h-[700px] overflow-y-auto">{createList(nestedList)}</div>
      )}
    </>
  )
}

export default TOCInline
