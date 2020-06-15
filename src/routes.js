import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientsController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryPanelController from './app/controllers/DeliveryPanelController';
import FileController from './app/controllers/FileController';
import NotificationController from './app/controllers/NotificationController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import DistributorProblemController from './app/controllers/DistributorDeliveryProblemController';

import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get(
  '/deliverymans/:deliverymanId/deliveries',
  DeliveryPanelController.index
);

routes.put(
  '/deliverymans/:deliverymanId/deliveries/:deliveryId',
  upload.single('file'),
  DeliveryPanelController.update
);

routes.put('/notifications/:id', NotificationController.update);

routes.get('/deliveries/:deliveryId/problems', DeliveryProblemController.index);
routes.post(
  '/deliveries/:deliveryId/problems',
  DeliveryProblemController.store
);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.post('/recipients', RecipientsController.store);
routes.get('/recipients', RecipientsController.index);
routes.get('/recipients/:id', RecipientsController.show);

routes.get('/deliverymans', DeliverymanController.index);
routes.get('/deliverymans/:id', DeliverymanController.show);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.post('/deliverymans', DeliverymanController.store);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.get('/deliveries/:id', DeliveryController.show);
routes.put('/deliveries/:id', DeliveryController.update);
routes.post('/deliveries', DeliveryController.store);
routes.delete('/deliveries/:id', DeliveryController.delete);

routes.delete(
  '/problems/:problemId/cancel-delivery',
  DistributorProblemController.delete
);
routes.get('/problems', DistributorProblemController.index);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
