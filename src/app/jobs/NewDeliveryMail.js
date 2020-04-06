import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, newDelivery } = data;
    console.log('A fila executou');

    Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova entrega.',
      template: 'newDelivery',
      context: {
        deliveryman: deliveryman.name,
        address: recipient.endereco,
        product: newDelivery.product,
      },
    });
  }
}

export default new NewDeliveryMail();
