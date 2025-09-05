import readingsData from '@/data/readingsData'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Readings' })

export default function Resources() {
  return (
    <>
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <p className="text-md leading-7 text-gray-500 dark:text-gray-400">
          以下是我学过的、正在学习的或想学的好资源，推荐给大家。
        </p>
      </div>
      <ReadingSection readingsData={readingsData} />
    </>
  )
}

function ReadingSection({ readingsData }) {
  return (
    <>
      {Object.keys(readingsData).map((key, index) => {
        return (
          <div key={readingsData[key].title} className="container pt-5">
            <h1 className="text-lg font-bold">{key}</h1>
            <ol className="mt-5 space-y-2">
              {readingsData[key].map((item, index) => {
                return (
                  <li key={item.title} className="text-gray-900 dark:text-gray-300">
                    <a
                      href={item.href}
                      target="_blank"
                      className={
                        item.href
                          ? 'no-underline hover:text-yellow-600 hover:underline hover:underline-offset-4'
                          : ''
                      }
                    >
                      {index + 1}. {item.title}
                    </a>
                  </li>
                )
              })}
            </ol>
          </div>
        )
      })}
    </>
  )
}
