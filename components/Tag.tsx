import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
  type: string
}

const Tag = ({ text, type = 'archive' }: Props) => {
  return (
    <Link
      href={`/${type}/${slug(text)}`}
      className="mr-1 rounded-md text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
