require('dotenv').config();

const {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    // Imprimir el menú
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //mostrar msj

        const termino = await leerInput('Ciudad:');
        //buscar ciudad
        const lugares = await busquedas.ciudad(termino);

        //seleccionar lugar
        const id = await listarLugares(lugares);

        if (id === '0') continue;

        const lugarSeleccionado = lugares.find((l) => l.id === id);

        //guardar en db
        busquedas.agregarHistorial(lugarSeleccionado.nombre);

        // if (id === '0') continue;

        //clima
        const clima = await busquedas.climaLugar(
          lugarSeleccionado.lat,
          lugarSeleccionado.lng
        );

        //mostrar resultado
        console.clear();
        console.log('\nInformacion de la ciudad\n'.green);
        console.log('Ciudad:'.cyan, lugarSeleccionado.nombre.magenta);
        console.log('Lat:'.cyan, lugarSeleccionado.lat);
        console.log('Lng:'.cyan, lugarSeleccionado.lng);
        console.log('Temperatura:'.cyan, clima.temp);
        console.log('Minima:'.cyan, clima.min);
        console.log('Maxima:'.cyan, clima.max);
        console.log('Descripcion: '.cyan, clima.desc.magenta);

        break;
      case 2:
        // const historialDB = leerDB();

        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });

        break;
    }
    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
