import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import cheerio from 'cheerio'

type Job = {
  id: number;
  title: string;
  company: {
    id: number;
    name: string;
    image_url?: string;
  };
  location: string;
  type: string;
  description: string;
}

export default class JobsController {
  public async index ({ request }: HttpContextContract) {
    const { page } = request.get()

    const body = await axios.get(`https://hipsters.jobs/jobs/?&p=${page || 1}`)
    const dom = cheerio.load(body.data)
    const jobs: Job[] = []

    const results = dom('.listing-item').map((_, el) => {
      return dom(el)
    }).toArray()
    for await (const el of results) {
      const job = dom(el)
      const name = job.find('.listing-item__info--item-company').text().replace(/\n\s{2,}/g, '').trim()
      const title = job.find('.listing-item__title').text().replace(/\n\s{2,}/g, '').trim()
      const url = job.find('.listing-item__title').first().children('a').attr('href') || ''
      const location = job.find('.listing-item__info--item-location').text().replace(/\n\s{2,}/g, '').trim()
      const type = job.find('.listing-item__employment-type').text().replace(/\n\s{2,}/g, '').trim()
      const description = job.find('.listing-item__desc').first().text().replace(/\n+/g, '').trim()
      const image_url = await this.ScrapeGoogleImages(name)

      jobs.push({
        id: this.extractIdFromUrl(url),
        title,
        company: {
          id: Date.now(),
          name,
          image_url,
        },
        location,
        type,
        description,
      })
    }

    return {
      data: jobs,
      count: jobs.length,
    }
  }

  public extractIdFromUrl (url: string) {
    const regex = /(https:\/\/hipsters.jobs\/job)\/([0-9]+)/g
    const testedUrl = regex.exec(url)

    if (testedUrl && testedUrl[2]) {
      return Number(testedUrl[2])
    } else {
      return 0
    }
  }
  public async show ({ params }: HttpContextContract) {
    const { id } = params

    const body = await axios.get(`https://hipsters.jobs/job/${id}`)
    const dom = cheerio.load(body.data)
    const descriptions: any[] = []

    const title = dom('.details-header__title').text().replace(/\n\s{2,}/g, '').trim()
    const name = dom('.listing-item__info--item-company').text().replace(/\n\s{2,}/g, '').trim()
    const location = dom('.listing-item__info--item-location').text().replace(/\n\s{2,}/g, '').trim()
    const type = dom('.job-type__value').first().text().replace(/\n\s{2,}/g, '').trim()

    dom('.details-body__title').each((_, desc) => {
      const description = dom(desc)
      descriptions.push({
        title: description.text(),
        value: description.next().text(),
      })
    })

    const image_url = await this.ScrapeGoogleImages(name)

    return {
      id: Number(id),
      title,
      company: {
        id: Date.now(),
        name,
        image_url,
      },
      location,
      type,
      descriptions,
    }
  }

  public async ScrapeGoogleImages (company: string): Promise<string> {
    const { data: image } = await axios.get(
      `https://www.google.com/search?q=${company}&rlz=1C1GCEU_pt-BRBR898BR898&sxsrf=ALeKk03CZ-1Z5KdvzYXhLo3jHmNlPTHdGw:1592261526667&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjBr7619ITqAhXVH7kGHfwlAW8Q_AUoAXoECBcQAw&biw=1278&bih=959`
    )

    const CheerioImage = cheerio.load(image)
    const img = CheerioImage('img')
    const imgArray = img.toArray()
    const image_url = imgArray[1].attribs.src

    return image_url
  }
}
