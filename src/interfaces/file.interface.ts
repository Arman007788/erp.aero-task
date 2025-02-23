import { FileEntity } from "../entities/file.entity";

export interface FileDowloadResponseProps {
  path: string;
  name: string;
}

export interface PaginationProps {
  list_size: string;
  page: string;
}

export interface FileListResponseProps {
  total: number;
  data: FileEntity[];
}
