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

const Produto = mongoose.model('Produto', produtoSchema);

app.get('/produto', async (req, res) => {
  try {
    const produto = await Produto.find();
    res.status(200).json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});
app.post('/produto', async (req, res) => {
    const newProduto = new Produto(req.body);
    await newProduto.save();
    res.status(201).json(newProduto);
  });
  
  app.put('/produto/:produtoId', async (req, res) => {
    const updatedProduto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduto);
  });
  
  app.delete('/produto/:produtoId', async (req, res) => {
    await Produto.findByIdAndDelete(req.params.id);
    res.status(204).send();
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log (`App running on port ${PORT}`);
  });
  