import * as Yup from 'yup';
import { Op } from 'sequelize';
import Recipient from '../models/Recipient';

class RecipientController {
  async show(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);
    return res.json(recipient);
  }

  async index(req, res) {
    const search = await Recipient.findAll({
      where: {
        nome: req.query.like
          ? { [Op.iLike]: `%${req.query.like}%` }
          : { [Op.regexp]: '.+' },
      },
    });

    return res.json(search);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number().required(),
      complemento: Yup.string(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const recipient = Recipient.create(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();
