import { Entity, Column, OneToMany } from "typeorm";
import { IsEmail, Length } from "class-validator";
import { BaseEntity } from "./base.entity";
import { TokenEntity } from "./token.entity";
import { FileEntity } from "./file.entity";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @Column()
  @Length(3, 50)
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "varchar" })
  phoneNumber: string;

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens: TokenEntity[];

  @OneToMany(() => FileEntity, (file) => file.user)
  files: File[];
}
