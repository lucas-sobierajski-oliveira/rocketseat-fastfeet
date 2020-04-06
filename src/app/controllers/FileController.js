class FileController {
  async store(req, res) {
    console.log(req.file);
    return res.json('ok');
  }
}

export default new FileController();
