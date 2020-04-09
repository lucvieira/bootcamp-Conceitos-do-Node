const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  //Capturando corpo da requisição (json)
  const { title, url, techs } =  request.body;

  //Criando id única
  const id = uuid();

  //Validando se id gerado está no formato correto
  if( !isUuid( id ) ){
    return response.status(400).json({error: 'Invalid project ID'})
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push( repositorie )

  return response.json( repositorie );
});

app.put("/repositories/:id", ( request, response ) => {
  
  //Capturando id do repositório
  const { id } = request.params;

  const { title, url, techs } = request.body;  

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id );

  if( repositorieIndex < 0 )
    return response.status(400).json({ error: "Repositorie not found."});

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes
  } 

  repositories[repositorieIndex] = repositorie;

  return response.json( repositorie );
});

app.delete("/repositories/:id", (req, res) => {
  
  //Capturando id do repositório
  const { id } = req.params;

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id );

  if( repositorieIndex < 0 )
    return res.status(400).json({ error: "Repositorie not found."});

  repositories.splice( repositorieIndex, 1 );

  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  
  //Capturando id do repositório
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id );

  if( repositorieIndex < 0 )
    return response.status(400).json({ error: "Repositorie not found."});

  repositories[repositorieIndex].likes++;

  return response.json( repositories[repositorieIndex] );
});

module.exports = app;