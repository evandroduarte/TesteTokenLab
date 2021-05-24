const connection = require("../database/connection");
const bcrypt = require("bcryptjs");

module.exports = {
  async create(request, response) {
    const { user_name, user_email } = request.body;

    const userCheck = await connection("users")
      .where("user_email", user_email)
      .first();

    if (!userCheck) {
      const user_password = await bcrypt.hash(request.body.user_password, 10);

      const user = await connection("users").insert({
        user_name,
        user_email,
        user_password,
      });
      return response.json(user);
    }

    return response.status(400).send({
      error: "Usuário já cadastrado!",
    });
  },
};
