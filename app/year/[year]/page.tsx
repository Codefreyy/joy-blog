import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

// Generate metadata for each year
export async function generateMetadata({
  params,
}: {
  params: { year: string }
}): Promise<Metadata> {
  const year = params.year
  return genPageMetadata({
    title: year,
    description: `${siteMetadata.title} ${year} 年的文章`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/year/${year}/feed.xml`,
      },
    },
  })
}

// Generate static paths for each year based on the posts' years
export const generateStaticParams = async () => {
  const years = Array.from(new Set(allBlogs.map((post) => new Date(post.date).getFullYear())))
  const paths = years.map((year) => ({
    year: year.toString(),
  }))
  return paths
}

// Page component filtered by year
export default function YearPage({ params }: { params: { year: string } }) {
  const year = params.year
  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => new Date(post.date).getFullYear().toString() === year))
  )
  return <ListLayout posts={filteredPosts} title={`${year} 年的文章`} />
}
