import mongo from "@/lib/mongo";
const { ObjectId } = require('mongodb');

export default async function handleClientesApi(req, res) {
  //const conn = await mongo;
  const db = await mongo.db();
  const clientes = await db.collection('clientes');
  switch (req.method) {
    case "GET":
      try {
        let data;
        data = await clientes.find({}).sort({ created_at: -1 }).toArray();
        return res.status(200).json({ status: 'success', message: 'clientes encontrados', data: data });
      } catch (err) {
        return res.status(400).json({ status: 'error', message: err });
      }
      break;
    case "POST":
      try {
        var data = JSON.parse(req.body);
        let address = `${data.address1} | ${data.address2} | ${data.address3}`;
        data.address = address;
        delete data.address1;
        delete data.address2;
        delete data.address3;
        var cliente = await clientes.insertOne({ ...data, created_at: new Date() });
        if (cliente.insertedCount > 0) {
          return res.json({ status: 'success', message: 'Cliente creado exitosamente.' });
        }
      } catch (err) {
        return res.status(400).json({ status: 'error', message: err });
      }
      break;
    case "PUT":
      try {
        var data = JSON.parse(req.body);
        var id = ObjectId(data.id);
        let address = `${data.address1} | ${data.address2} | ${data.address3}`;
        data.address = address;
        delete data.address1;
        delete data.address2;
        delete data.address3;
        let cliente = await clientes.updateOne(
          {
            _id: id
          },
          {
            $set: {
              name: data.name,
              address: data.address,
              rfc: data.rfc,
              email: data.email,
              updated_at: new Date()
            }
          },
          {
            upsert: true
          }
        );
        if (cliente.modifiedCount === 1 || cliente.matchedCount === 1) {
          return res.status(200).json({ status: 'success', message: 'Cliente actualizado correctamente' });
        } else {
          return res.status(400).json({ status: 'error', message: 'Error al acutalizar los datos del cliente' });
        }

      } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
      }
      break;
    case 'DELETE':
      var id_cliente = ObjectId(req.query.id);
      try {
        let deleted = await clientes.deleteOne({ _id: id_cliente });
        return res.status(200).json({ status: 'success', message: 'Cliente eliminado.', data: deleted });
      } catch (err) {
        return res.status(400).json({ status: 'error', message: err.message });
      }
      break;
  }
}