import { Entity, Column, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { BaseEntity } from "./base.entity";

@Entity({ name: "files" })
export class FileEntity extends BaseEntity {
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  originalName: string;

  @Column({ type: "varchar" })
  extension: string;

  @Column({ type: "varchar" })
  mimeType: string;

  @Column({ type: "float" })
  size: number;

  @ManyToOne(() => UserEntity, (user) => user.files, { onDelete: "CASCADE" })
  user: UserEntity;
}
