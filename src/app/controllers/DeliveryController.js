import * as Yup from 'yup';
import { parseISO, format } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Notification from '../schemas/Notification';
import File from '../models/File';

import NewDeliveryMail from '../jobs/NewDeliveryMail';
import Queue from '../../lib/Queue';

class DeliveryController {
  async show(req, res) {
    const delivery = await Delivery.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        { model: Deliveryman, as: 'deliveryman' },
        { model: Recipient, as: 'recipient' },
      ],
    });
    return res.json(delivery);
  }

  async index(req, res) {
    const allDelivery = await Delivery.findAll({
      where: {
        product: req.query.like
          ? { [Op.iLike]: `%${req.query.like}%` }
          : { [Op.regexp]: '.+' },
      },
      include: [
        { model: Deliveryman, as: 'deliveryman' },
        { model: Recipient, as: 'recipient' },
        { model: File, as: 'signature' },
      ],
      order: ['id'],
    });

    return res.json(allDelivery);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { deliveryman_id, recipient_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);
    const recipient = await Recipient.findByPk(recipient_id);

    if (!(recipient && deliveryman)) {
      return res.json({ error: 'Id not find' });
    }

    const newDelivery = await Delivery.create(req.body);

    await Notification.create({
      content: `Nova correspondecia pendente. produto: (${req.body.product})`,
      deliveryman: deliveryman_id,
    });

    await Queue.add(NewDeliveryMail.key, {
      deliveryman,
      recipient,
      newDelivery,
    });

    return res.json(newDelivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { deliveryman_id, recipient_id } = req.body;

    if (
      !(
        (await Recipient.findByPk(recipient_id)) &&
        (await Deliveryman.findByPk(deliveryman_id))
      )
    ) {
      return res.json({ error: 'Id not find' });
    }

    const deliveryId = req.params.id;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery id no exists.' });
    }

    const newDelivery = await delivery.update(req.body);

    return res.json(newDelivery);
  }

  async delete(req, res) {
    const deliveryId = req.params.id;

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery no exists.' });
    }

    const date = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx-03:00");
    const parsedDate = parseISO(date);

    await delivery.update({ canceled_at: parsedDate });

    return res.json(delivery);
  }
}

export default new DeliveryController();
