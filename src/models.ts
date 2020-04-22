import {IsInt, IsOptional, IsString, Matches, Max, Min, MinLength} from "class-validator";
import {Type} from "class-transformer";

export class CreateStudentModel {
    @MinLength(3)
    @IsString()
    name: string;

    @MinLength(3)
    @IsString()
    last_name: string;

    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {message: "Date of birth must mach with the format: YYYY-MM-DD"})
    date_of_birth?: string;
}

export class PaginationRequestModel {
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page: number;

    @Min(5)
    @Max(50)
    @Type(() => Number)
    page_size: number;

    @IsOptional()
    search?: string;
}
