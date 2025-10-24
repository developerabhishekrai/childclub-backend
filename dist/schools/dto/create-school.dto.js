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
exports.CreateSchoolDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const school_entity_1 = require("../entities/school.entity");
class CreateSchoolDto {
}
exports.CreateSchoolDto = CreateSchoolDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School name',
        example: 'Kendriya Vidyalaya Deoria',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School description',
        example: 'A prestigious government school providing quality education',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School type',
        enum: school_entity_1.SchoolType,
        example: school_entity_1.SchoolType.PRIMARY,
    }),
    (0, class_validator_1.IsEnum)(school_entity_1.SchoolType),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School address',
        example: 'Vill: Olipatti, P.o: Pathardewa',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'City',
        example: 'Deoria',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State',
        example: 'Uttar Pradesh',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country',
        example: 'India',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Postal code',
        example: '274404',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number',
        example: '+91-8858724547',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address',
        example: 'kv.deoria@kvs.gov.in',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Website URL',
        example: 'https://kvdeoria.edu.in',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Established year',
        example: 1995,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSchoolDto.prototype, "establishedYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total students',
        example: 1200,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSchoolDto.prototype, "totalStudents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total teachers',
        example: 45,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSchoolDto.prototype, "totalTeachers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total classes',
        example: 24,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSchoolDto.prototype, "totalClasses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School facilities',
        example: 'Library, Computer Lab, Science Lab, Sports Ground',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "facilities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School vision',
        example: 'To provide excellence in education and character building',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "vision", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School mission',
        example: 'Empowering students with knowledge, skills and values',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSchoolDto.prototype, "mission", void 0);
//# sourceMappingURL=create-school.dto.js.map