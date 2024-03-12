const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class PlatesImageController {
  async update(request, response){
    const plate_id = request.params.id;
    const imageFileName = request.file.filename;

    const diskStorage = new DiskStorage();

    const plate = await knex("plates")
    .where({ id: plate_id }).first();

    if(!plate){
      throw new AppError("Prato inexistente.", 401)
    };

    if(plate.image){
      await diskStorage.deleteFile(plate.image);
    };

    const filename = await diskStorage.saveFile(imageFileName);
    plate.image = filename;

    await knex("plates").update({image: filename}).where({ id: plate_id })

    return response.json(plate);

  }
};

module.exports = PlatesImageController;