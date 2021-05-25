const connection = require("../database/connection");
const bcrypt = require("bcryptjs");

module.exports = {
  async create(request, response) {
    const { user_name, user_email } = request.body;

    let userCheck = '';

    if (user_name != undefined && user_email != undefined && request.body.user_password != undefined) {
      const user_password = await bcrypt.hash(request.body.user_password, 10);

      try{
        userCheck = await connection("users")
        .where("user_email", user_email)
        .first();
      }catch(err){
        console.log(err);
      }

      const user = await connection("users").insert({
        user_name,
        user_email,
        user_password,
      });
      return response.json(user);
    }else if(user_name === undefined || user_email === undefined){
      return response.send({
        message: "Dados incorretos!"
      })
    }

    return response.send({
      message: "Usuário já cadastrado!",
    });
  },
};
