import { getServerSideSitemap } from 'next-sitemap'

export const getServerSideProps = async context => {
  const { res, req } = context

  const allProduct = []
  await getAllProductsPublic({
    params: { limit: -1, page: -1 }
  }).then(res => {
    const data = res?.data?.products
    data?.map(item => {
      allProduct.push(item.slug)
    })
  })

  const productUrls = allProduct.map(slug => ({
    loc: `https://ecommerce-leopard.vercel.app/product/${slug}`,
    lastMod: new Date().toIOString(),
    priority: 0.9
  }))

  const homeUrl = {
    loc: 'https://ecommerce-leopard.vercel.app',
    lastMod: new Date().toIOString(),
    priority: 0.9
  }

  const url = [homeUrl, productUrls]

  return getServerSideSitemap(req, res, url)
}

const SiteMap = () => null
export default SiteMap
