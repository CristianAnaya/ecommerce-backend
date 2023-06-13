import { SetMetadata } from "@nestjs/common";
import { JwtRole } from "./jwt-roles";

export const HasRoles = (...roles: JwtRole[]) => SetMetadata('roles', roles)