/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import yearData from 'app/year-data.json'
import { useState } from 'react'
import { slug } from 'github-slugger'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            前一篇
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            前一篇
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            后一篇
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            后一篇
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const yearCounts = yearData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts
  const [activeType, setActiveType] = useState(() =>
    pathname.split('/').includes('year') ? 'year' : 'tags'
  )
  return (
    <>
      <div>
        <div className="pb-6 pt-6">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 hover:text-primary-400 dark:text-gray-100 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-[#fcfbfa] pt-5 shadow-md dark:bg-[#2c2e3f] dark:shadow-gray-800/40 sm:flex">
            <div className="flex w-full justify-start gap-3 px-6 pt-2">
              {' '}
              <Link
                href="/blog"
                className="cursor-pointer font-bold uppercase hover:text-primary-400"
              >
                全部文章
              </Link>
              <div>
                <span
                  onClick={() => {
                    setActiveType('tags')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setActiveType('tags')
                  }}
                  tabIndex={0}
                  role="button"
                  className={`${activeType == 'tags' ? 'underline underline-offset-4' : ''} cursor-pointer uppercase hover:text-primary-400`}
                >
                  标签
                </span>{' '}
                <span
                  onClick={() => {
                    setActiveType('year')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setActiveType('year')
                  }}
                  role="button"
                  tabIndex={0}
                  className={`${activeType == 'year' ? 'underline underline-offset-4' : ''} cursor-pointer uppercase hover:text-primary-400`}
                >
                  年份
                </span>
              </div>
            </div>{' '}
            <div className="px-6 py-4">
              {activeType == 'tags' ? (
                <ul>
                  {sortedTags.map((t) => {
                    return (
                      <li key={t} className="my-3 ">
                        {decodeURIComponent(pathname.split('/archive/')[1]) === slug(t) ? (
                          <h3 className="inline py-2 text-sm font-bold uppercase text-primary-500">
                            {`${t} (${tagCounts[t]})`}
                          </h3>
                        ) : (
                          <Link
                            href={`/archive/${slug(t)}`}
                            className={` py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500`}
                            aria-label={`View posts tagged ${t}`}
                          >
                            {`${t} (${tagCounts[t]})`}
                          </Link>
                        )}
                      </li>
                    )
                  })}{' '}
                </ul>
              ) : (
                <ul>
                  {Object.keys(yearCounts).map((key) => {
                    return (
                      <li
                        key={key}
                        className={` cursor-pointer  text-sm font-medium uppercase  hover:text-primary-400  dark:hover:text-primary-500 ${decodeURIComponent(pathname.split('/year/')[1]) === slug(key) ? 'text-primary-500' : 'text-gray-500 dark:text-gray-300'} `}
                      >
                        <Link
                          href={`/year/${slug(key)}`}
                          className="py-2 text-sm font-medium uppercase"
                        >
                          {key} ({yearCounts[key]})
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
          <div>
            <ul>
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags } = post
                return (
                  <Link href={`/${path}`} key={path}>
                    <li className=" transform cursor-pointer rounded-lg px-6 py-5 transition-transform hover:scale-101 hover:bg-[#fcfbfa] dark:hover:bg-[#2b2e40]">
                      <article className="group flex flex-col space-y-1 xl:space-y-0">
                        <div>
                          <h2 className="text-xl font-bold leading-8 tracking-tight">
                            <Link
                              href={`/${path}`}
                              className="text-gray-900 group-hover:text-primary-500 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <dl>
                            <dt className="sr-only">Published on</dt>
                            <dd className="text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">
                              <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                            </dd>
                          </dl>
                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                            {summary}
                          </div>
                        </div>
                      </article>
                    </li>
                  </Link>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
