import { Body, Controller, DefaultValuePipe, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { HasRoles } from 'src/auth/jwt/has-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRole } from 'src/auth/jwt/jwt-roles';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { API } from 'src/config/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {

    constructor(private productService: ProductsService) {}

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get() 
    findAll() {
        return this.productService.findAll();
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('pagination') 
    async pagination(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number = 5
    ): Promise<Pagination<Product>> {
        return this.productService.paginate({
            page,
            limit,
            route: `http://${API}:3000/products/pagination`
        });
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('category/:id_category') 
    findByCategory(@Param('id_category', ParseIntPipe) id_category: number) {
        return this.productService.findByCategory(id_category);
    }

    @HasRoles(JwtRole.ADMIN, JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get('search/:name') 
    findByName(@Param('name') name: string) {
        return this.productService.findByName(name);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post() 
    @UseInterceptors(FilesInterceptor('files[]', 2))
    create(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                  new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
              }),
        )
        file: Array<Express.Multer.File>,
        @Body() product: CreateProductDto
        ) {
        return this.productService.create(file, product);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('upload/:id') 
    @UseInterceptors(FilesInterceptor('files[]', 2))
    updateWithImage(
        @UploadedFiles(
            new ParseFilePipe({
                validators: [
                  new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                  new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
              }),
        )
        file: Array<Express.Multer.File>,
        @Param('id', ParseIntPipe) id: number,
        @Body() product: UpdateProductDto
        ) {
        return this.productService.updateWithImage(file, id, product);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(':id') 
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() product: UpdateProductDto
    ) {
        return this.productService.update(id, product);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Delete(':id') 
    delete(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.productService.delete(id);
    }
}
