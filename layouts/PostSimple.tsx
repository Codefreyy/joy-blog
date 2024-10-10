import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { Toc } from 'pliny/mdx-plugins'
import TOCInline from '@/components/TOCInline'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  toc: Toc
}

export default function PostLayout({ content, next, prev, children, toc }: LayoutProps) {
  const { filePath, path, slug, date, title } = content

  return (
    <SectionContainer>
      <ScrollTopAndComment />

      <article>
        <div>
          <header>
            <div className="space-y-1 border-b border-gray-200 pb-10 text-center dark:border-gray-700">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="dark:divide-gray-700  xl:grid xl:grid-cols-4">
            <div className="toc not-prose col-span-1 mr-3 mt-8 hidden xl:block">
              <TOCInline toc={toc} />
            </div>
            <div className="ml-3 divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>
              <div>
                {' '}
                <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
                  <Link href={editUrl(filePath)}>View on GitHub</Link>
                </div>
                {siteMetadata.comments && (
                  <div
                    className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300"
                    id="comment"
                  >
                    <Comments slug={slug} />
                  </div>
                )}
              </div>
            </div>

            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && prev.path && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/${prev.path}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Previous post: ${prev.title}`}
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && next.path && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/${next.path}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Next post: ${next.title}`}
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
