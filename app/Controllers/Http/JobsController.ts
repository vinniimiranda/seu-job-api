import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import cheerio from 'cheerio';

export default class JobsController {
  public async index ({ request }: HttpContextContract) {
    const { page } = request.get()

    const body = await axios.get(`https://hipsters.jobs/jobs/?&p=${page || 1}`)
    const dom = cheerio.load(body.data)
    const jobs: any = []

    dom('.listing-item').each((i: number, el) => {
      const job = dom(el)
      const title = job.find('.listing-item__title').text().replace(/[^a-zA-Z ]/g, '').trim()
      const companyName = job.find('.listing-item__info--item-company').text().replace(/[^a-zA-Z ]/g, '').trim()
      const location = job.find('.listing-item__info--item-location').text().replace(/[^a-zA-Z ]/g, '').trim()
      const description = job.find('.listing-item__desc').first().text().replace(/\n/g, '').trim()
      const type = job.find('.listing-item__employment-type').text().replace(/[^a-zA-Z ]/g, '').trim()


      jobs.push({
        title,
        companyName,
        location,
        description,
        type

      })

    })


    return {
      data: jobs,
      count: jobs.length
    }
  }

}
