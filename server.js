const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // Archivo db.json
const middlewares = jsonServer.defaults();
const PORT = process.env.PORT || 8080; // Usar el puerto asignado por Render o 8080 por defecto

server.use(middlewares);
server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server está corriendo en el puerto ${PORT}`);
});