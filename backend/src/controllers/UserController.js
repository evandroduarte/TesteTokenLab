const connection = require("../database/connection");
const bcrypt = require("bcryptjs");

module.exports = {
  async create(request, response) {
    const { user_name, user_email } = request.body;

    let userCheck;

    if (
      user_name !== undefined &&
      user_email !== undefined &&
      user_email !== "" &&
      request.body.user_password !== undefined &&
      request.body.user_password !== ""
    ) {
      const user_password = await bcrypt.hash(request.body.user_password, 10);

      try {
        userCheck = await connection("users")
          .where("user_email", user_email)
          .first();
      } catch (err) {
        console.log(err);
      }

      if (userCheck !== undefined) {
        return response.status(500).send("Usuário já cadastrado");
      }

      const user = await connection("users").insert({
        user_name,
        user_email,
        user_password,
      });
      return response.json(user);
    } else {
      return response.status(500).send("Dados Incorretos");
    }
  },
};
