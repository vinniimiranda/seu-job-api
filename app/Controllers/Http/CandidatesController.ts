import Candidate from 'App/Models/Candidate'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import Address from 'App/Models/Address';
import Contact from 'App/Models/Contact';

export default class CandidatesController {

  public async show ({ response, auth }: HttpContextContract) {
    try {
      const userId = auth.user?.$attributes.id
      const candidate = await Candidate.query().preload('user', user => user.select('name', 'email')).preload('address').preload('contact').where('userId', userId).first()
      return candidate;
    } catch (error) {
      console.log(error);

      return response.status(404).send({ message: "Candidate not found" })
    }
  }

  public async update ({ request, auth, response }: HttpContextContract) {
    try {
      const userId = auth.user?.$attributes.id
      const data = request.only(['birth_date', 'document'])
      const { name, email } = request.input('user')
      const addressData = request.input('address')
      const contactData = request.input('contact')


      const candidate = await Candidate.findByOrFail('user_id', userId)
      const user = await User.findByOrFail('id', userId)
      const address = await Address.findBy('candidate_id', candidate.id)
      const contact = await Contact.findBy('candidate_id', candidate.id)

      if (!address) {
        await Address.create({ ...addressData, candidateId: candidate.id })
      }
      else {
        address.merge(addressData)
        await address.save()
      }

      if (!contact) {
        await Contact.create({ ...contactData, candidateId: candidate.id })
      }
      else {
        contact.merge(contactData)
        await contact.save()
      }

      candidate.merge(data)
      await candidate.save()

      user.merge({ name, email })
      await user.save()

      return { message: "Profile updated!" };
    } catch (error) {
      return response.status(404).send({ message: "Candidate not found" })
    }
  }

}
