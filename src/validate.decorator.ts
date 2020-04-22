import {validate, ValidationError} from "class-validator";
import {plainToClass} from "class-transformer";

function validationFactory<T>(metadataKey: Symbol, model: { new (...args: any[]): T}, source: "body" | "query") {
    return function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
        Reflect.defineMetadata(metadataKey, model, target, propertyName);

        const method = descriptor.value;
        descriptor.value = async function () {
            const model = Reflect.getOwnMetadata(metadataKey, target, propertyName);

            const [req, res] = arguments;
            const plain = req[source];

            const errors = await validate(plainToClass(model,  plain));
            if (errors.length > 0) {
                res.status(400).json(transformValidationErrorsToJSON(errors));
                return;
            }

            return method.apply(this, arguments);
        };
    };
}

export const ValidateQuery = dto => validationFactory(Symbol("validate-query"), dto, "query");
export const ValidateBody = dto => validationFactory(Symbol("validate-body"), dto, "body");

function transformValidationErrorsToJSON(errors: ValidationError[]) {
    return errors.reduce((p, c: ValidationError) => {
        if (!c.children || !c.children.length) {
            p[c.property] = Object.keys(c.constraints).map(key => c.constraints[key]);
        } else {
            p[c.property] = transformValidationErrorsToJSON(c.children);
        }
        return p;
    }, {});
}
