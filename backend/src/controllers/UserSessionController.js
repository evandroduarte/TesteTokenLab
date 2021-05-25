const connection = require('../database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = {
    
    async create(request, response){

        //Geração do token de autorizaçao, duraçao de 24 hrs
        function generateToken(params = {}) {
            return token = jwt.sign(params, authConfig.secret, {
                expiresIn: 86400,
            });
        }

        const { user_email, user_password } = request.body;
        
        let user = '';

        try{
            user = await connection('users')
            .where('user_email', user_email)
            .first()
        }catch(err){
            console.log(err);
        }

        if(user === undefined){
            return response.status(400).send('Usuário não encontrado')
        }

        if(!await bcrypt.compare(user_password, user.user_password)){
            return response.send({ message: 'Senha inválida' });
        }
        response.send({
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_surname: user.user_surname,
            user_token: generateToken({
                id: user.user_id
            })
        })
    }
}