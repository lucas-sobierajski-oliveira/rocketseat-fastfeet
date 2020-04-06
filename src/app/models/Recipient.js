import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        rua: Sequelize.STRING,
        numero: Sequelize.INTEGER,
        complemento: Sequelize.STRING,
        estado: Sequelize.STRING,
        cidade: Sequelize.STRING,
        cep: Sequelize.STRING,
        endereco: {
          type: Sequelize.VIRTUAL,
          get() {
            return `rua ${this.rua} N${this.numero}${
              this.complemento ? `, ${this.complemento}` : ''
            }, ${this.estado}/${this.cidade}, cep ${this.cep}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Recipient;
