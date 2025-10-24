"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSchoolDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const school_entity_1 = require("../entities/school.entity");
class UpdateSchoolDto {
}
exports.UpdateSchoolDto = UpdateSchoolDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School type', enum: school_entity_1.SchoolType, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(school_entity_1.SchoolType),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School address', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'City', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'State', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Postal code', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Website URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Established year', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSchoolDto.prototype, "establishedYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total students', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSchoolDto.prototype, "totalStudents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total teachers', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSchoolDto.prototype, "totalTeachers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total classes', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateSchoolDto.prototype, "totalClasses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School facilities', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "facilities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School achievements', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "achievements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School vision', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "vision", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School mission', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSchoolDto.prototype, "mission", void 0);
//# sourceMappingURL=update-school.dto.js.map