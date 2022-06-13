import { Client } from '@notionhq/client'
import slugify from 'slugify'
import { CreationDetails } from '@/components/CreationDetails'

const CreationPage = ({ creation }) => {
  console.log(creation)
  return <CreationDetails creation={creation} />
  // return <pre>{JSON.stringify(creation, null, 2)}</pre>
}

export const getStaticPaths = async () => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY })

  const data = await notion.blocks.children.list({
    block_id: process.env.NOTION_CREATIONS_PAGE,
  })

  const paths: string[] = []

  data.results.forEach((result) => {
    if (result.type === 'child_page') {
      paths.push({
        params: {
          slug: slugify(result.child_page.title).toLocaleLowerCase(),
        },
      })
    }
  })

  console.log(paths)

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params: { slug } }) => {
  //fetch details for creation
  const notion = new Client({ auth: process.env.NOTION_API_KEY })

  const data = await notion.blocks.children.list({
    block_id: process.env.NOTION_CREATIONS_PAGE,
  })

  const page = data.results.find((result) => {
    if (result.type === 'child_page') {
      const { title } = result.child_page
      const resultSlug = slugify(title).toLocaleLowerCase()
      return resultSlug === slug
    }
    return false
  })

  const blocks = await notion.blocks.children.list({
    block_id: page.id,
  })

  const title: string = page.child_page.title
  const description: string[] = []
  const performers: string[] = []
  const photos: string[] = []
  const detailsHeadings: string[] = []
  const detailsSubHeadings: string[] = []

  blocks.results.forEach((block) => {
    if (block.type === 'bulleted_list_item') {
      detailsSubHeadings.push(block.bulleted_list_item.rich_text[0].plain_text)
    }

    if (block.type === 'paragraph') {
      description.push(block.paragraph.rich_text[0].plain_text)
    }

    if (block.type === 'heading_2') {
      detailsHeadings.push(block.heading_2.rich_text[0].plain_text)
    }

    if (block.type === 'image') {
      photos.push(block.image.external.url)
    }
  })

  return {
    props: {
      creation: {
        blocks,
        title,
        description,
        detailsHeadings,
        performers,
        photos,
      },
    },
  }
}

export default CreationPage
