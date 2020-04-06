import { format, parseISO } from 'date-fns';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CancellationDeliveryMail from '../jobs/CancellationDeliveryMail';

class DeliveryProblemController {
  async index(req, res) {
    const deliveryProblems = await DeliveryProblem.findAll({
      include: [
        {
          model: Delivery,
          as: 'delivery',
          include: [{ model: Recipient, as: 'recipient' }],
        },
      ],
    });

    return res.json(deliveryProblems);
  }

  async delete(req, res) {
    const deliveryProblem = await DeliveryProblem.findByPk(
      req.params.problemId,
      {
        include: [
          {
            model: Delivery,
            as: 'delivery',
            include: [
              {
                model: Deliveryman,
                as: 'deliveryman',
              },
              { model: Recipient, as: 'recipient' },
            ],
          },
        ],
      }
    );

    if (!deliveryProblem) {
      return res.status(400).json({ error: 'Delivery problem id not exists.' });
    }

    const date = format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx-03:00");
    const parsedDate = parseISO(date);

    if (deliveryProblem.delivery.canceled_at) {
      return res.json({ error: 'delivery is already canceled.' });
    }

    await deliveryProblem.delivery.update({ canceled_at: parsedDate });

    await Queue.add(CancellationDeliveryMail.key, {
      deliveryProblem,
    });

    return res.json(deliveryProblem);
  }
}

export default new DeliveryProblemController();
