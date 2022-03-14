/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.http = (req, res) => {
  let message = 'Hello ' + req.query.name || req.body.name || process.env.devNAME;
  res.status(200).send(message);
};
