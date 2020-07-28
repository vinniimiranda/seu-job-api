import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import cheerio from 'cheerio';

type Job = {
  id: number;
  title: string;
  company: {
    id: number;
    name: string;
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

    dom('.listing-item').each((_, el) => {
      const job = dom(el)
      const name = job.find('.listing-item__info--item-company').text().replace(/\n\s{2,}/g, '').trim()
      const title = job.find('.listing-item__title').text().replace(/\n\s{2,}/g, '').trim()
      const location = job.find('.listing-item__info--item-location').text().replace(/\n\s{2,}/g, '').trim()
      const type = job.find('.listing-item__employment-type').text().replace(/\n\s{2,}/g, '').trim()
      const description = job.find('.listing-item__desc').first().text().replace(/\n/g, '').trim()

      jobs.push({
        id: Date.now(),
        title,
        company: {
          id: Date.now(),
          name
        },
        location,
        type,
        description,
      })

    })

    return {
      data: jobs,
      count: jobs.length
    }
  }

}
