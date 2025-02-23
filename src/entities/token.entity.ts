import { Entity, Column, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { BaseEntity } from "./base.entity";

@Entity({ name: "tokens" })
export class TokenEntity extends BaseEntity {
  @Column({ type: "text", unique: true })
  accessToken: string;

  @Column({ type: "text", unique: true })
  refreshToken: string;

  @Column({ type: "boolean", default: true })
  active: boolean;

  @ManyToOne(() => UserEntity, (user) => user.tokens, { onDelete: "CASCADE" })
  user: UserEntity;
}
