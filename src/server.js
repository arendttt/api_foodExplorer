require("express-async-errors");
require("dotenv/config");

const cors = require("cors");

const express = require("express");
const AppError = require("./utils/AppError");
const uploadConfig = require("../src/configs/uploads");

const routes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

// tratando os error
app.use(( error, request, response, next ) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  };

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal Server Error"
  });
});

// definindo a porta
const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));