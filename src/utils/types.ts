export type NotePage = {
  id: string;
  label: string;
  dateCreated: number;
};

export type Annotation = {
  path: string;
  color: string;
  width: number;
};

export type DrawTool = 'Pencil' | 'Eraser';
export type DrawState = {
  tool: DrawTool;
};
