import Link from 'next/link'
import Image from 'next/image'
import { Client } from '@notionhq/client'
import slugify from 'slugify'

const CreationsPage = ({ creations }) => {
  console.log(creations)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{' '}
          <a className="text-blue-600" href="https://nextjs.org">
            Idan Cohen's creations!
          </a>
        </h1>

        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          {creations.map((creation) => (
            <Link
              key={creation.id}
              href={`/creations/${slugify(creation.title).toLocaleLowerCase()}`}
            >
              <a className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600">
                <h3 className="text-2xl font-bold">{creation.title} &rarr;</h3>
                {/* <Image
                  src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/34cecb20-5142-4f4f-9534-c155803afc22/orfeoasaclown-2.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220328%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220328T010330Z&X-Amz-Expires=3600&X-Amz-Signature=f8ef66952fbff89d83234d33e8aa6f51825b3f3689967f48267914fa63e37166&X-Amz-SignedHeaders=host&x-id=GetObject"
                  height={100}
                  width={100}
                  className="mt-4 text-xl"
                /> */}
              </a>
            </Link>
          ))}
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  )
}

export const getStaticProps = async () => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY })

  const data = await notion.blocks.children.list({
    block_id: process.env.NOTION_CREATIONS_PAGE,
  })

  const creations: string[] = []

  data.results.forEach((result) => {
    if (result.type === 'child_page') {
      creations.push({
        id: result.id,
        title: result.child_page.title,
      })
    }
  })

  return {
    props: {
      creations,
    },
  }
}

export default CreationsPage
