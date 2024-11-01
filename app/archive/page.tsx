import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import yearData from 'app/year-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const yearCounts = yearData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  console.log('year', yearCounts, sortedTags)

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-start justify-start dark:divide-gray-700 ">
          <h1 className="text-lg font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl sm:leading-10 ">
            Tags
          </h1>
          <div className="flex max-w-lg flex-wrap">
            {tagKeys.length === 0 && 'No tags found.'}
            {sortedTags.map((t) => {
              return (
                <div key={t} className="mb-2 mr-5 mt-2">
                  <Tag text={t} />
                  <Link
                    href={`/tags/${slug(t)}`}
                    className=" text-sm font-semibold uppercase text-gray-400 dark:text-gray-300"
                    aria-label={`View posts tagged ${t}`}
                  >
                    {` (${tagCounts[t]})`}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <h1 className="text-lg font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl sm:leading-10 ">
            Year
          </h1>
          <div>
            {Object.keys(yearCounts).map((key) => {
              return (
                <div key={key}>
                  {key} : {yearCounts[key]}
                </div>
              )
            })}
          </div>
          {/* <div className="flex max-w-lg flex-wrap">
          {yearCounts.map((t) => {
            return (
              <div key={t} className="mb-2 mr-5 mt-2">
                <Tag text={t} />
                <Link
                  href={`/tags/${slug(t)}`}
                  className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                  aria-label={`View posts tagged ${t}`}
                >
                  {` (${tagCounts[t]})`}
                </Link>
              </div>
            )
          })}
        </div> */}
        </div>
      </div>
    </>
  )
}
