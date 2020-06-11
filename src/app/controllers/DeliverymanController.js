import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const allDeliveryman = await Deliveryman.findAll({
      where: {
        active: true,
        name: req.query.like
          ? { [Op.iLike]: `%${req.query.like}%` }
          : { [Op.regexp]: '.+' },
      },
    });

    return res.json(allDeliveryman);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      // avatar_id?
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // conferir se email ja existe
    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists.' });
    }

    const newDeliveryman = await Deliveryman.create(req.body);

    return res.json(newDeliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { email } = req.body;

    if (email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { email },
      });

      if (deliverymanExists) {
        return res.status(400).json({ error: 'This email already exists.' });
      }
    }

    const deliverymanId = req.params.id;

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: 'deliveryman id no exists' });
    }

    const updateDeliveryman = await deliveryman.update(req.body);

    return res.json(updateDeliveryman);
  }

  async delete(req, res) {
    const deliverymanId = req.params.id;
    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: 'deliveryman id no exists' });
    }

    await deliveryman.update({ active: false });

    return res.json(deliveryman);
  }
}

export default new DeliverymanController();
