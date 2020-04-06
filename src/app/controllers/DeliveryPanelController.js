import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO, format } from 'date-fns';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryPanelController {
  async index(req, res) {
    const { deliverymanId } = req.params;
    const { canceled } = req.query;
    const allDelivery = await Delivery.findAll({
      where: {
        deliveryman_id: deliverymanId,
        canceled_at: null,
        end_at: canceled ? { [Op.ne]: null } : null,
      },
    });

    return res.json(allDelivery);
  }

  async update(req, res) {
    const { deliverymanId, deliveryId } = req.params;

    if (!(deliverymanId && deliveryId)) {
      return res.status(400).json({ error: 'Missing some id.' });
    }

    const allDeliveriesDay = await Delivery.findAndCountAll({
      where: {
        deliveryman_id: deliverymanId,
        start_at: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
      },
    });

    if (allDeliveriesDay.count > 5) {
      return res
        .status(400)
        .json({ error: 'The maximum number of deliveries per day is 5.' });
    }

    const delivery = await Delivery.findOne({
      where: {
        deliveryman_id: deliverymanId,
        id: deliveryId,
        canceled_at: null,
      },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not find.' });
    }

    const date = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx-03:00");
    const parsedDate = parseISO(date);
    console.log(parsedDate.getHours());
    if (!(parsedDate.getHours() >= 6 && parsedDate.getHours() < 18)) {
      return res.status(401).json({
        error: 'product pick-up times are between 8am - 6pm',
      });
    }

    if (delivery.start_at === null) {
      await delivery.update({ start_at: parsedDate });
    } else {
      if (!req.file) {
        return res
          .status(401)
          .json({ error: 'Requires the signature of the sender' });
      }

      const { originalname: name, filename: path } = req.file;
      const file = await File.create({ name, path });

      await delivery.update({ end_at: parsedDate, signature_id: file.id });
    }

    return res.json(delivery);
  }
}

export default new DeliveryPanelController();
