export type Task = {
  kind: "task" | "originalTask" | "survey";
  course: string;
  title: string;
  link: string;
  deadline: string;
  startline?: string;
  id: string | null;
};
