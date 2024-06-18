const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const swaggerDocumento = YAML.load('./swagger/swagger.yaml');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocumento));

mongoose.connect('mongodb://mongodb:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB', error);
});

const produtoSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const produto = mongoose.model('produto', produtoSchema);

app.get('/produtos', async (req, res) => {
  try {
    const produtos = await produto.find();
    res.status(200).json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});
app.post('/produtos', async (req, res) => {
    const newproduto = new produto(req.body);
    await newproduto.save();
    res.status(201).json(newproduto);
  });
  
  app.put('/produtos/:id', async (req, res) => {
    const updatedproduto = await produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedproduto);
  });
  
  app.delete('/produtos/:id', async (req, res) => {
    await produto.findByIdAndDelete(req.params.id);
    res.status(204).send();
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log (`App running on port ${PORT}`);
  });
  