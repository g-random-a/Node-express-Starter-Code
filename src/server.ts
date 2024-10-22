import app from "./app";

const PORT = process.env.PORT || 5000;

const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
