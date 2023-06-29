import { Order } from "src/orders/order.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'address' })
export class Address {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    address: string;

    @Column()
    neighborhood: string;

    @Column()
    id_user: number;

    @Column( { type: 'datetime', default: () => 'CURRENT_TIMESTAMP'} )
    created_at: Date;

    @Column( { type: 'datetime', default: () => 'CURRENT_TIMESTAMP'} )
    updated_at: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'id_user' })
    user: User;

    @OneToMany(() => Order, (order) => order.id)
    order: Order;
}