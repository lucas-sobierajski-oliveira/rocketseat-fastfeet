import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'CancellationDeliveryMail';
  }

  async handle({ data }) {
    console.log(data.deliveryProblem);
    console.log('A fila executou');
    console.log(data.deliveryProblem.delivery.deliveryman.name);
    Mail.sendMail({
      to: `${data.deliveryProblem.delivery.deliveryman.name} <${data.deliveryProblem.delivery.deliveryman.email}>`,
      subject: 'Canelamento de entrega.',
      template: 'CancellationDelivery',
      context: {
        deliveryman: data.deliveryProblem.delivery.deliveryman.name,
        address: data.deliveryProblem.delivery.recipient.endereco,
        product: data.deliveryProblem.delivery.product,
        problem: data.deliveryProblem.description,
      },
    });
  }
}

export default new NewDeliveryMail();
