'use strict';

module.exports = function (router) {

    router.post('/', async function (req, res) {
        const matrix = req.body.matrix;
        const airports = req.body.generatedAirports;
        const size = req.body.size;
        let clouds = req.body.generatedClouds;

        let isSecure = true;
        let auxiliarAirports = [...airports];
        let removeAirports = [...airports];
        let daysFirst = 0;
        let days = 0;

        // Faz um loop para contagem dos dias
        while (isSecure) {
          days++;

          let auxiliarClouds = [];

          // Preenche os pontos adjacentes à cada nuvem
          for (let c = 0; clouds.length > c; c++) {
            const { pointX, pointY } = clouds[c];

            const pointXRight = pointX + 1;
            const pointXLeft = pointX - 1;

            const pointYTop = pointY - 1;
            const pointYBottom = pointY + 1;

            //Preenche eixo X para a direita
            if (pointX < size -1) {
              matrix[pointY].fill('C', pointXRight, pointX + 2);
              auxiliarClouds.push({pointX: pointXRight, pointY});
            }

            //Preenche eixo X para a esquerda
            if (pointX > 0) {
              matrix[pointY].fill('C', pointXLeft, pointX);
              auxiliarClouds.push({pointX: pointXLeft, pointY});
            }
              
            //Preenche eixo Y para baixo
            if (pointY < size - 1) {
              matrix[pointYBottom].fill('C', pointX, pointXRight);
              auxiliarClouds.push({pointX, pointY: pointYBottom});
            }

            //Preenche eixo Y para cima
            if (pointY > 0) {
              matrix[pointYTop].fill('C', pointX, pointXRight); 
              auxiliarClouds.push({pointX, pointY: pointYTop});
            }
          }

          clouds = clouds.concat(auxiliarClouds);

          // Verifica aeroportos cobertos pelas nuvens
          for (let a = 0; airports.length > a; a++) {
            if (clouds.find(element => element.pointX === airports[a].pointX && element.pointY === airports[a].pointY)) {
              
              removeAirports = remove(removeAirports, airports[a]);

              if (daysFirst === 0) daysFirst = days;
            }
          }

          // Para caso todos os aeroportos estejam cobertos por nuvens
          if (removeAirports.length === 0) isSecure = false;
        }

        // Muda os aeroportos cobertos para D para melhor visualização
        for (let d = 0; airports.length > d; d++) {
          matrix[airports[d].pointY].fill('D', airports[d].pointX, airports[d].pointX + 1); 
        }

        res.json({
          message: 'Calc ok', 
          matrix,
          days,
          daysFirst
        })
    });

    function remove(arrOriginal, elementToRemove){
      return arrOriginal.filter(function(el){return el !== elementToRemove});
    }
};
