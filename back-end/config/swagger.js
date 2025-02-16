const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'Album Figurine Marvel API',
    description: 'API per la gestione di figurine, scambi e utenti'
  },
  components: {
    schemas: {
        Album: {
            type: 'object',
            properties: {
                userId: { type: 'string', description: 'ID utente collegato all\'album' },
                figurine: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                        idMarvel: { type: 'string', description: 'ID della figurina Marvel' },
                        name: { type: 'string', description: 'Nome dell\'eroe' },
                        image: { type: 'string', format: 'url', description: 'URL immagine della figurina' },
                        count: { type: 'integer', description: 'Numero di copie di una figurina' }
                        }
                    }
                }
            }
        },
        Exchange: {
            type: 'object',
            properties: {
                offeredBy: { type: 'string', description: 'ID dell\'utente che offre lo scambio' },
                offeredFigurines: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                        idMarvel: { type: 'string' },
                        name: { type: 'string' }
                        }
                    }
                },
                requestedFigurines: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                        idMarvel: { type: 'string' },
                        name: { type: 'string' }
                        }
                    }
                },
                creditAmount: { type: 'integer', description: 'Crediti richiesti nello scambio' },
                type: {
                    type: 'string',
                    enum: ['doppioni', 'multiplo', 'crediti'],
                    description: 'Tipo di scambio'
                },
                status: {
                    type: 'string',
                    enum: ['pending', 'accepted', 'rejected'],
                    description: 'Stato dello scambio'
                }
            }
        },
        Figurina: {
            type: 'object',
            properties: {
                idMarvel: { type: 'string', description: 'ID univoco della figurina Marvel' },
                name: { type: 'string', description: 'Nome del supereroe' },
                image: { type: 'string', format: 'url', description: 'URL immagine del supereroe' }
            }
        },
        User: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Nome univoco dell\'utente' },
                email: { type: 'string', format: 'email', description: 'Email dell\'utente' },
                password: { type: 'string', description: 'Password dell\'utente' },
                favoriteHero: { type: 'string', description: 'Eroe preferito dell\'utente' },
                birthDate: { type: 'string', format: 'date', description: 'Data di nascita (opzionale)' },
                phone: { type: 'string', description: 'Numero di telefono (opzionale)' },
                credits: { type: 'integer', description: 'Crediti disponibili' }
            }
        }
    }
  },
  host: 'localhost:3000', 
  schemes: ['http']
};

const outputFile = './config/swagger-output.json'; 
const routes = ['./app.js']; 

swaggerAutogen(outputFile, routes, doc);

