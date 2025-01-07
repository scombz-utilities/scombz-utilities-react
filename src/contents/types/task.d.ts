export type Task = {
  kind: "task" | "originalTask" | "survey" | "classroomTask";
  course: string;
  title: string;
  link: string;
  deadline: string;
  deadlineDate?: Date;
  startline?: string;
  id: string | null;
  courseURL?: string;
};
