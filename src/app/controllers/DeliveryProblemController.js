import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryProblemController {
  async index(req, res) {
    const { deliveryId } = req.params;

    if (!(await Delivery.findByPk(deliveryId))) {
      return res.status(400).json({ error: 'Delivery id not exists.' });
    }

    const deliveryProblems = await DeliveryProblem.findAll({
      where: { delivery_id: deliveryId },
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const { deliveryId } = req.params;
    console.log(deliveryId);

    if (!(await Delivery.findByPk(deliveryId))) {
      return res.status(400).json({ error: 'Delivery id not exists.' });
    }

    const newProblem = await DeliveryProblem.create({
      delivery_id: req.params.deliveryId,
      description: req.body.description,
    });

    return res.json(newProblem);
  }
}

export default new DeliveryProblemController();
