export class Step {
  url: string;
  title: string;
  next_step: string;
  prev_step: string;
  start_date: Date;
  end_date: Date;
  requirements: string[];
  context: string;
  manager: string;
  executor: string;
  status?: number;
}
