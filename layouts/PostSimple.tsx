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
const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

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
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-left">
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-muted-foreground pb-8 dark:divide-muted xl:divide-y-0">
            <div className="xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-2xl pb-8 pt-10 dark:prose-invert">
                <div className="tocr not-prose">
                  <TOCInline toc={toc} />
                </div>
                <div>{children}</div>
              </div>
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
              <div className="flex flex-col gap-4 text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && prev.path && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/${prev.path}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                      aria-label={`Previous post: ${prev.title}`}
                    >
                      下一篇:{prev.title}
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
                      上一篇:{next.title};
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
