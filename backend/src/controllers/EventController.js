const connection = require("../database/connection");


module.exports = {
    async indexAll(request, response){

        try{
            const events = await connection('events')
            .select('*')

            return response.json(events);
        }catch(err){
            console.log(err);
            return response.status(500).send('Erro ao localizar eventos!')
        }
    },

    async indexSingle(request, response){
        const { id } = request.params;

        try{
            const events = await connection('events')
            .where("event_id", id)
            .select('*')

            return response.json(events);
        }catch(err){
            console.log(err);
            return response.status(500).send('Erro ao localizar eventos!')
        }
    },

    async create(request, response){
        const {
            event_description,
            event_startHour,
            event_endHour,
            event_dateStart,
            event_dateEnd
        } = request.body;

        const user_id = request.headers.user;

        if(event_description !== undefined && event_description !== ''){
            try{
                const event = await connection("events").insert({
                    event_description,
                    event_startHour,
                    event_endHour,
                    event_dateStart,
                    event_dateEnd,
                    user_id
                })
    
                return response.send(event);
            }catch(err){
                console.log(err);
                return response.status(400).send('Dados Incorretos!');
            }
        }else{
            return response.status(400).send('Dados Incorretos');
        }

    },

    async update(request, response){
        const { id } = request.params;

        const {
            event_description,
            event_startHour,
            event_endHour,
            event_dateStart,
            event_dateEnd,
        } = request.body;

        try{
            let event = await connection("events").where("event_id", id).update({
                event_description,
                event_startHour,
                event_endHour,
                event_dateStart,
                event_dateEnd,
            });

            if(event){
                response.status(200).send('Evento atualizado com sucesso!');
            }else{
                response.status(400).send('Evento não encontrado!')
            }

        }catch(err){
            console.log(err);
            response.status(500).send('Erro ao atualizar evento!')
        }


    },

    async delete(request, response){
        const { id } = request.params;

        try{
            await connection("events").where("event_id", id).delete();

            return response.status(200).send('Evento deletado com sucesso!')
        }catch(err){
            console.log(err);

            return response.status(500).send('Falha ao deletar evento!');
        }
    }

}