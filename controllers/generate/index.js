'use strict';

module.exports = function (router) {

    router.post('/', async function (req, res) {
        const airports = req.body.airports;
        const clouds = req.body.clouds;
        const size = parseInt(req.body.size, 0);
        const matrix = [];
        const generatedAirports = [];
        const generatedClouds = [];

        // Gerar mapa
        for (let i = 0; size > i; i++) {
          const row = [];

          for (let j = 0; size > j; j++) {
            row.push('E');
          }
          matrix.push(row);
        }

        let generatedPoints = [];

        // Gerar aeroportos
        for (let a = 0; airports > a; a++) {
          const { pointX, pointY } = generatePoint(generatedPoints, size);

          matrix[pointY].fill('A', pointX, pointX + 1); 
          generatedAirports.push({pointX, pointY});

          generatedPoints.push(`${pointX},${pointY}`);
        }

        // Gerar nuvens
        for (let c = 0; clouds > c; c++) {
          const { pointX, pointY } = generatePoint(generatedPoints, size);

          matrix[pointY].fill('C', pointX, pointX + 1); 
          generatedClouds.push({pointX, pointY});

          generatedPoints.push(`${pointX},${pointY}`);
        }
        
        res.json({
          message: 'Data generate ok',
          matrix,
          generatedAirports,
          generatedClouds,
        })
    });

    // Gera os pontos e verifica duplicidade, caso haja gera um novo
    function generatePoint(generatedPoints, size) {
      let pointX = getRandomInt(0, size);
      let pointY = getRandomInt(0, size);
      let point = `${pointX},${pointY}`;

      if (generatedPoints.find(element => element === point))
        return generatePoint(generatedPoints, size);
      else
        return { pointX, pointY };
    }

    // Gera números inteiros aleatórios
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
};
