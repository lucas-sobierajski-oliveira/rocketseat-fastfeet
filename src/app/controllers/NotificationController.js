import Notification from '../schemas/Notification';

class NotificationController {
  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(req.params.id, {
      read: true,
      new: true,
    });

    return res.json(notification);
  }
}

export default new NotificationController();
