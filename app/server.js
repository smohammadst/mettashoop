const createError = require("http-errors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocJs = require("swagger-jsdoc");
const { allRouter } = require("./router/router.routes");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { COOKIE_PARSER_SECRET_KEY } = require("./module/constans");
const cors = require("cors");
module.exports = class Server {
  #express = require("express");
  #app = this.#express();
  constructor(PORT) {
    this.configApplications(PORT);
    this.createServer(PORT);
    this.configDataBase();
    this.initClientSession();
    this.createRouter();
    this.errorHandling();
  }
  configApplications(PORT) {
    const morgan = require("morgan");
    const path = require("path");
    this.#app.use(morgan("dev"));
    this.#app.use(this.#express.urlencoded({ extended: true, limit: '50mb' }));
    this.#app.use(this.#express.json({ limit: '50mb' }));
    this.#app.use(this.#express.static(path.join(__dirname, "..", "public")));
    this.#app.use(
      "/api-doc",
      swaggerUi.serve,
      swaggerUi.setup(
        swaggerDocJs({
          swaggerDefinition: {
            openapi: "3.0.0",
            info: {
              title: "سایت فروشگاهی",
              version: "1.0.0",
              description: "ساخت یک سایت فروشگاهی  ",
            },
            servers: [
              {
                url: `https://gajetmajet.iran.liara.run/`,
              },
            ],
            components: {
              securitySchemes: {
                BearerAuth: {
                  type: "http",
                  scheme: "bearer",
                  bearerFormat: "JWT",
                },
              },
            },
            security: [{ BearerAuth: [] }],
          },
          apis: ["./app/router/**/*.js"],
        }),
        { explorer: true }
      )
    );
  }
  createServer(PORT) {
    this.#app.listen(PORT, () => console.log("Server is Running"));
    this.#app.use(
      cors({
        origin: "*",
      })
    );
  }
  async configDataBase() {
    const mongoose = require("mongoose");
    mongoose.set("strictQuery", true);
    mongoose
      .connect(process.env.DATABASE_URL, {
        authSource: "admin",
      })
      .then(console.log("connet"))
      .catch((e) => console.log(e));
    process.on("SIGBREAK", async () => {
      await connection.close();
      process.exit(0);
    });
  }
  initClientSession() {
    this.#app.use(cookieParser(COOKIE_PARSER_SECRET_KEY));
    this.#app.use(
      session({
        secret: COOKIE_PARSER_SECRET_KEY,
        resave: true,
        saveUninitialized: true,
        cookie: {
          secure: true,
        },
      })
    );
  }
  errorHandling() {
    this.#app.use((req, res, next) => {
      next(createError.NotFound("صفحه ی مورد نظر پدا نشد"));
    });
    this.#app.use((error, req, res, next) => {
      const serverError = createError.InternalServerError();
      const statusCode = error?.status || error?.code || serverError.status;
      const message = error?.message || serverError.message;
      return res.status(statusCode).json({
        data: {
          statusCode,
          message,
        },
      });
    });
  }
  createRouter() {
    this.#app.use(allRouter);
  }
};
