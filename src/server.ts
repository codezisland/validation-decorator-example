import "reflect-metadata";

import * as express from "express";
import * as cors from "cors";
import {ValidateBody, ValidateQuery} from "./validate.decorator";
import {PaginationRequestModel, CreateStudentModel} from "./models";

const app = express();
app.use([express.json(), cors()]);

class StudentController {
    @ValidateQuery(PaginationRequestModel)
    static getStudents(req, res){
        const {page, page_size, search} = req.query;
        res.json({page, page_size, total: 1, items: [{name: "Peter", last_name: "Parker", date_of_birth: "1990-04-23"}]});
    }

    @ValidateBody(CreateStudentModel)
    static createStudent(req, res){
        const {name, last_name, date_of_birth} = req.body;
        res.json({name, last_name, date_of_birth});
    }
}

app.get("/students", StudentController.getStudents);
app.post("/students", StudentController.createStudent);

app.listen(3000, () => console.log(`app is listening`));
